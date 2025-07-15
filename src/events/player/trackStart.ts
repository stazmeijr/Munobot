import { TextChannel } from "discord.js";

export default {
  name: "trackStart",
  once: false,
  async execute(client: any, player: any, track: any) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    if (!channel) return;

    await channel.send(
      `🎶 Now playing: \`${track.info.title}\` by \`${track.info.author}\`.`
    );
  },
};