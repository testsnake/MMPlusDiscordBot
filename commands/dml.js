const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Tutorial on backing up MM+ save data'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15701'});
	},
};
