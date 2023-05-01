const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('expatch')
		.setDescription('ExPatch Download Link')
		.setDescriptionLocalizations({
			de: 'ExPatch Download-Link',
			'en-GB': 'ExPatch Download Link',
			'en-US': 'ExPatch Download Link',
			'es-ES': 'Enlace de descarga de ExPatch',
			fr: 'Lien de téléchargement ExPatch',
			nl: 'ExPatch Downloadlink',
			'pt-BR': 'Link para download do ExPatch',
			'zh-CN': 'ExPatch 下载链接',
			ja: 'ExPatchダウンロードリンク',
			'zh-TW': 'ExPatch 下載連結',
			ko: 'ExPatch 다운로드 링크',
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/mods/388083'});
	},
};
