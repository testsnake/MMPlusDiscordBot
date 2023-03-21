const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chart')
		.setDescription('Comfy Charting Manual'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/603835223691624451/1038680701668696105/image.png'});
	},
};
