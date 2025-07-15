import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  cooldown: 5, 
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong and latency info!"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const ping = interaction.client.ws.ping;
    const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(
      `🏓 Pong!\nLatency: **${apiLatency}ms**\nWS Ping: **${ping}ms**`
    );
  },
};