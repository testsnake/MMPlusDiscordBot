const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgrade')
		.setDescription('Upgrading Tutorial'),
	async execute(interaction) {
		await interaction.reply({ content: ' https://gamebanana.com/tuts/15371 '});
	},
};
