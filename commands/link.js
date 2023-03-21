const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Links to click on to download Eden Project'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1008978799989362808/1078429246151741500/image.png'});
	},
};
