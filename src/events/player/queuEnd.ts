import { TextChannel } from "discord.js";

export default {
  name: "queueEnd",
  once: false,
  async execute(client: any, player: any) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    if (!channel) return;

    const autoplay = false;

    if (autoplay) {
      player.autoplay(player);
    } else {
      player.destroy();
      await channel.send("❌ Queue has ended. Leaving voice channel.");
    }
  },
};