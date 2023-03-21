const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('Eden Project Download Link'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://i.imgur.com/xpuxXeq.gif '});
	},
};
