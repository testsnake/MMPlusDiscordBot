const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mmm')
        .setDescription('Links Miku Miku Model'),
    async execute(interaction) {
        await interaction.reply({ content: 'https://github.com/blueskythlikesclouds/MikuMikuLibrary/releases'});
    },
};
