import { Client, Events } from "discord.js";
import { logger } from "../../utils/logger";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    logger.success(`Bot is online as ${client.user?.tag}`);
  },
};