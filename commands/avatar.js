const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to get the avatar of.')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const avatarEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setFooter({ text: `${mikuBotVer}`});
    await interaction.reply({ embeds: [avatarEmbed] });
  },
};
