import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays information about this server."),

  async execute(interaction: ChatInputCommandInteraction) {
    const { guild } = interaction;

    if (!guild) {
      return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    }

    const iconURL = guild.iconURL({ size: 512 }) ?? undefined;

    const embed = new EmbedBuilder()
      .setTitle(`📊 Server Info`)
      .setColor(0x5865f2)
      .setThumbnail(iconURL || null)
      .addFields(
        { name: "Name", value: guild.name, inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        {
          name: "Created At",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Members",
          value: `${guild.memberCount.toLocaleString()} members`,
          inline: true,
        },
        {
          name: "Channels",
          value: `${guild.channels.cache.size.toLocaleString()} total`,
          inline: true,
        },
        {
          name: "Roles",
          value: `${guild.roles.cache.size.toLocaleString()} roles`,
          inline: true,
        }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};