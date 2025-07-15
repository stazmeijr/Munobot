import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  User,
} from "discord.js";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Shows information about a user.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user to get info of")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user: User = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Info`)
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .addFields(
        { name: "Tag", value: user.tag, inline: true },
        { name: "ID", value: user.id, inline: true },
        { name: "Bot", value: user.bot ? "✅ Yes" : "❌ No", inline: true },
        {
          name: "Account Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: false,
        }
      )
      .setColor(0x2f3136)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (member) {
      embed.addFields(
        {
          name: "Joined Server",
          value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
          inline: false,
        },
        {
          name: "Highest Role",
          value: `${member.roles.highest}`,
          inline: true,
        },
        {
          name: "Nickname",
          value: member.nickname || "None",
          inline: true,
        }
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};