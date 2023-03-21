const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drive')
		.setDescription('Google Drive Bypass'),
	async execute(interaction) {
		await interaction.reply({ content: 'Due to a lot of people downloading our mods, the Google Drive has been capped. Follow this video to get around it! https://www.youtube.com/watch?v=u-v9SI3vFmE'});
	},
};
