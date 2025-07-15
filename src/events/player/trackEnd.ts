import { logger } from "../../utils/logger";

export default {
  name: "trackEnd",
  once: false,
  async execute(client: any, player: any) {
    logger.info(`[TrackEnd] Track ended in guild ${player.guildId}`);
  },
};