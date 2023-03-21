const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dlc')
		.setDescription('dlc link'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://i.imgur.com/P4yap04.png https://store.steampowered.com/app/1887030/Hatsune_Miku_Project_DIVA_Mega_Mix_Extra_Song_Pack/'});
	},
};
