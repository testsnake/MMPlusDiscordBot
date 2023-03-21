const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hb')
		.setDescription('Holy Beans'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1009649075227984062/1044484546822938684/video0.mp4'});
	},
};
