const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');
const { config } = require('../../config.json');
const log = require('../../logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('downgrade')
		.setDescription('Downgrading MM+ Tutorial')
		.setDescriptionLocalizations({
			de: 'MM+ Downgrade-Tutorial',
			'en-GB': 'Downgrading MM+ Tutorial',
			'en-US': 'Downgrading MM+ Tutorial',
			'es-ES': 'Tutorial para degradar MM+',
			fr: 'Tutoriel sur la rétrogradation de MM+',
			nl: 'MM+ Downgrade Tutorial',
			'pt-BR': 'Tutorial de downgrade do MM+',
			'zh-CN': 'MM+降级教程',
			ja: 'M39+ダウングレードチュートリアル',
			'zh-TW': 'M39+降級教程',
			ko: 'M39+ 다운그레이드 튜토리얼',
		}),
	async execute(interaction) {
		pm2Metrics.actionsPerformed.inc();
		await interaction.reply({ content: ' https://gamebanana.com/tuts/15371 '});
	},
};
