const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wiki')
        .setDescription('Links to the wiki'),
    async execute(interaction) {
       interaction.reply({ content: 'https://wiki.hatsunemikuprojectdivamegamixplusnever.works/'});
    }};