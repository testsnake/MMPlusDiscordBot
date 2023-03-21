const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hfr')
		.setDescription('Hate France'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://youtu.be/v74vH3LjSuo'});
	},
};
