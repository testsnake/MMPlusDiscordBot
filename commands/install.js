const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('install')
		.setDescription('Mod installation guide'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15379'});
	},
};
