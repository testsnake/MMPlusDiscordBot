const { SlashCommandBuilder } = require('discord.js');

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
		})
		.setNameLocalizations({
			de: 'Downgrade',
			'en-GB': 'Downgrade',
			'en-US': 'Downgrade',
			'es-ES': 'Degradar',
			fr: 'Rétrograder',
			nl: 'Downgrade',
			'pt-BR': 'Downgrade',
			'zh-CN': '降级',
			ja: 'ダウングレード',
			'zh-TW': '降級',
			ko: '다운그레이드',
		}),
	async execute(interaction) {
		await interaction.reply({ content: ' https://gamebanana.com/tuts/15371 '});
	},
};
