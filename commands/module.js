const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('module')
		.setDescription('Eden Project Module Spreadsheet'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://bit.ly/EdenProjectSongModuleSheet '});
	},
};
