const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Tool that shows the version of the game')

        .setDMPermission(true),
    async execute(interaction) {
        pm2Metrics.actionsPerformed.inc();
        await interaction.reply({ content: 'http://testsnake.github.io/DivaWebTools/checker'});
    },
};
