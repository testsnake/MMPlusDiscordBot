const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hf')
		.setDescription('Hit Fan'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1009649075227984062/1044486785679507536/video0.mov'});
	},
};
