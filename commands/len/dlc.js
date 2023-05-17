const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dlc')
		.setDescription('dlc link')
		.setNameLocalizations({
			ja: 'dlcリンク',
			ko: 'dlc링크',
			'zh-TW': 'dlc連結',
			'zh-CN': 'dlc链接',
		})
		.setDescriptionLocalizations({
			de: 'DLC-Link',
			'en-GB': 'DLC link',
			'en-US': 'DLC link',
			'es-ES': 'Enlace de DLC',
			fr: 'Lien DLC',
			nl: 'DLC-link',
			'pt-BR': 'Link do DLC',
			'zh-CN': 'DLC链接',
			ja: 'DLCリンク',
			'zh-TW': 'DLC連結',
			ko: 'DLC 링크',
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://store.steampowered.com/app/1887030/Hatsune_Miku_Project_DIVA_Mega_Mix_Extra_Song_Pack/'});
	},
};
