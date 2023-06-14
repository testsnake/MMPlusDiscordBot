const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Tutorial on backing up MM+ save data')
		.setDescriptionLocalizations({
			de: 'Tutorial zur Sicherung von MM+ Speicherdaten (English only)',
			'en-GB': 'Tutorial on backing up MM+ save data',
			'en-US': 'Tutorial on backing up MM+ save data',
			'es-ES': 'Tutorial sobre cómo hacer una copia de seguridad de los datos guardados de MM+ (solo en inglés)',
			fr: 'Tutoriel sur la sauvegarde des données de MM+ (en anglais uniquement)',
			nl: 'Tutorial over het maken van een back-up van MM+ save data (alleen in het Engels)',
			'pt-BR': 'Tutorial sobre como fazer backup dos dados salvos do MM+ (apenas em inglês)',
			'zh-CN': 'M39+存档数据备份教程（仅英文）',
			ja: 'M39+セーブデータのバックアップに関するチュートリアル（英語のみ）',
			'zh-TW': 'M39+存檔數據備份教程（僅英文）',
			ko: 'M39+ 저장 데이터 백업에 대한 튜토리얼 (영어만 가능)',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
		.setDMPermission(true),
	async execute(interaction) {
		pm2Metrics.actionsPerformed.inc();
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15701'});
	},
};
