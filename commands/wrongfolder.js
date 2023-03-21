const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wrongfolder')
		.setDescription('Wrong Folder'),
	async execute(interaction) {
		await interaction.reply({ content: ' https://i.imgur.com/xpuxXeq.gif '});
	},
};
