const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgrade')
		.setNameLocalizations({
			de: 'aktualisieren',
			'en-GB': 'upgrade',
			'en-US': 'upgrade',
			'es-ES': 'actualizar',
			fr: 'mise-à-jour',
			nl: 'upgraden',
			'pt-BR': 'atualizar',
			'zh-CN': '升级',
			ja: 'アップグレード',
			'zh-TW': '升級',
			ko: '업그레이드',
		})
		.setDescription('Updating MM+ Tutorial')
		.setDescriptionLocalizations({
			de: 'Aktualisiere das MM+ Tutorial',
			'en-GB': 'Updating MM+ Tutorial',
			'en-US': 'Updating MM+ Tutorial',
			'es-ES': 'Actualizando el Tutorial de MM+',
			fr: 'Mise à jour du tutoriel de MM+',
			nl: 'Updaten van de MM+ handleiding',
			'pt-BR': 'Atualizando o Tutorial do MM+',
			'zh-CN': '更新 M39+ 教程',
			ja: 'M39+のチュートリアルを更新する',
			'zh-TW': '更新 M39+ 教程',
			ko: 'MM+ 튜토리얼 업데이트',
		})
		.setDefaultMemberPermissions([PermissionFlagsBits.SEND_MESSAGES])
		.setDMPermission(true),
	async execute(interaction) {
		pm2Metrics.actionsPerformed.inc();
		await interaction.reply({ content: ' https://gamebanana.com/tuts/15371 '});
	},
};
