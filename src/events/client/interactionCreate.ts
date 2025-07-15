import {
  Events,
  Interaction,
  Collection,
  ChatInputCommandInteraction,
  Client,
} from "discord.js";


interface Command {
  data: {
    name: string;
    toJSON(): any;
  };
  cooldown?: number;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}


interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as ExtendedClient;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name)!;
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expiration = timestamps.get(interaction.user.id)! + cooldownAmount;

      if (now < expiration) {
        const remaining = ((expiration - now) / 1000).toFixed(1);
        return interaction.reply({
          content: `Please wait **${remaining}s** before using \`/${command.data.name}\` again.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const replyPayload = {
        content: "There was an error while executing this command!",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyPayload);
      } else {
        await interaction.reply(replyPayload);
      }
    }
  },
};