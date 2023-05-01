const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setNameLocalizations({
			de: 'Sicherungskopie',
			'en-GB': 'Backup',
			'en-US': 'Backup',
			'es-ES': 'Copia de seguridad',
			fr: 'Sauvegarde',
			nl: 'Back-up',
			'pt-BR': 'Backup',
			'zh-CN': '备份',
			ja: 'バックアップ',
			'zh-TW': '備份',
			ko: '백업',
		})
		.setDescription('Tutorial on backing up MM+ save data (English only)')
		.setDescriptionLocalizations({
			de: 'Tutorial zur Sicherung von MM+ Speicherdaten (English only)',
			'en-GB': 'Tutorial on backing up MM+ save data (English only)',
			'en-US': 'Tutorial on backing up MM+ save data (English only)',
			'es-ES': 'Tutorial sobre cómo hacer una copia de seguridad de los datos guardados de MM+ (solo en inglés)',
			fr: 'Tutoriel sur la sauvegarde des données de MM+ (en anglais uniquement)',
			nl: 'Tutorial over het maken van een back-up van MM+ save data (alleen in het Engels)',
			'pt-BR': 'Tutorial sobre como fazer backup dos dados salvos do MM+ (apenas em inglês)',
			'zh-CN': 'M39+存档数据备份教程（仅英文）',
			ja: 'M39+セーブデータのバックアップに関するチュートリアル（英語のみ）',
			'zh-TW': 'M39+存檔數據備份教程（僅英文）',
			ko: 'M39+ 저장 데이터 백업에 대한 튜토리얼 (영어만 가능)',
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15701'});
	},
};
