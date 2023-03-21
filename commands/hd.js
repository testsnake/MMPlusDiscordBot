const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hd')
		.setDescription('Hot Dog'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1008900328931995688/1040365318989688843/video0_1.mp4'});
	},
};
