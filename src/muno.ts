import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { config } from "./config";
import { RiffyClient } from "./classes/Client";
import { logger } from "./utils/logger";
import fs from "fs";
import path from "path";
import { GatewayDispatchEvents, GatewayDispatchPayload } from "discord.js";


const client: any = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();


const riffy = new RiffyClient(client);
client.riffy = riffy;

riffy.getSpotifyToken();
setInterval(() => riffy.getSpotifyToken(), 3000000);


client.once('ready', () => {
  client.riffy.init(client.user.id);
  logger.info('INITIATING RIFFY CLIENT')
});


client.on("raw", (data: GatewayDispatchPayload) => {
  if (
    ![
      GatewayDispatchEvents.VoiceStateUpdate,
      GatewayDispatchEvents.VoiceServerUpdate,
    ].includes(data.t)
  ) return;

  client.riffy?.updateVoiceState(data);
});

// Event handler
const eventsPath = path.join(__dirname, "events");
const categories = fs.existsSync(eventsPath) ? fs.readdirSync(eventsPath) : [];

for (const category of categories) {
  const categoryPath = path.join(eventsPath, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;

  const eventFiles = fs
    .readdirSync(categoryPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(categoryPath, file);
    const event = require(filePath).default ?? require(filePath);

    if (!event?.name || typeof event.execute !== "function") {
      logger.warn(`[Event] Skipped invalid: ${file}`);
      continue;
    }

    if (event.once) {
      if (category === "player") {
        client.riffy.once(event.name, (...args: any[]) =>
          event.execute(client, ...args)
        );
      } else {
        client.once(event.name, (...args: any[]) =>
          event.execute(...args, client)
        );
      }
    } else {
      if (category === "player") {
        client.riffy.on(event.name, (...args: any[]) =>
          event.execute(client, ...args)
        );
      } else {
        client.on(event.name, (...args: any[]) =>
          event.execute(...args, client)
        );
      }
    }

    logger.success(`[Event] Loaded: ${file}`);
  }
}

//  Slash Command Handler
const commands: any[] = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.existsSync(foldersPath)
  ? fs.readdirSync(foldersPath)
  : [];

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default ?? require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      logger.success(`[Command] Loaded: ${file}`);
    } else {
      logger.warn(`[Command] Invalid: ${file}`);
    }
  }
}


const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    logger.info("Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    logger.success("✅ Slash commands registered!");
    await client.login(config.token);
  } catch (error) {
    logger.error("❌ Failed to register slash commands or login.");
    logger.error(error);
  }
})();