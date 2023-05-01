const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('Tutorial on backing up MM+ save data')
		.setDescriptionLocalizations({
			de: 'Tutorial zur Sicherung von MM+ Speicherdaten',
			'en-GB': 'Tutorial on backing up MM+ save data',
			'en-US': 'Tutorial on backing up MM+ save data',
			'es-ES': 'Tutorial sobre cómo hacer una copia de seguridad de los datos guardados de MM+',
			fr: 'Tutoriel sur la sauvegarde des données de MM+',
			nl: 'Tutorial over het maken van een back-up van MM+ save data',
			'pt-BR': 'Tutorial sobre como fazer backup dos dados salvos do MM+',
			'zh-CN': 'M39+存档数据备份教程',
			ja: 'M39+セーブデータのバックアップに関するチュートリアル',
			'zh-TW': 'M39+存檔數據備份教程',
			ko: 'M39+ 저장 데이터 백업에 대한 튜토리얼',
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15701'});
	},
};
