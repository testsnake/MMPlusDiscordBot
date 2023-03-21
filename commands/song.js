const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('song')
		.setDescription('Eden Project Song Spreadsheet'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://bit.ly/EdenProjectSongModuleSheet '});
	},
};
