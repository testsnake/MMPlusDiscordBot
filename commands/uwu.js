const { SlashCommandBuilder } = require('discord.js');
const Uwuifier = require('uwuifier').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uwu')
		.setDescription('Uwu-ify your text!')
		.setDescriptionLocalizations({
			de: 'Uwu-ify Deinen Text!',
			'en-GB': 'Uwu-ify your text!',
			'en-US': 'Uwu-ify your text!',
			'es-ES': '¡Uwu-ifica tu texto!',
			fr: 'Uwu-ify votre texte !',
			nl: 'Maak uw tekst uwu!',
			'pt-BR': 'Transforme seu texto em uwu!',
			'zh-CN': '使您的文本uwu-ify！',
			ja: 'テキストをuwu-ifyしてください！',
			'zh-TW': '使您的文本uwu-ify！',
			ko: 'Uwu-ify 당신의 텍스트!',
		})
		.addStringOption(option =>
			option.setName('text')
				.setNameLocalizations({
					'es-ES': 'texto',
					fr: 'texte',
					nl: 'tekst',
					'pt-BR': 'texto',
					'zh-CN': '文本',
					ja: 'テキスト',
					'zh-TW': '文本',
					ko: '텍스트',
				})
				.setDescription('The text you want to uwu-ify.')
				.setDescriptionLocalizations({
					de: 'Der Text, den du Uwu-ig machen möchtest.',
					'en-GB': 'The text you want to uwu-ify.',
					'en-US': 'The text you want to uwu-ify.',
					'es-ES': 'El texto que quieres hacer Uwu-ig.',
					fr: 'Le texte que vous souhaitez Uwu-ifier.',
					nl: 'De tekst die u Uwu-ig wilt maken.',
					'pt-BR': 'O texto que você deseja Uwu-ificar.',
					'zh-CN': '您想要Uwu化的文本。 (目前仅支持拉丁字符)',
					ja: 'あなたがUwu-ifyしたいテキスト。 (現在はラテン文字のみ対応しています)',
					'zh-TW': '您想要Uwu化的文本。 (目前僅支持拉丁字符)',
					ko: 'Uwu-ify하려는 텍스트. (현재는 라틴 문자만 지원됩니다)',
				})
				.setRequired(true)),
	async execute(interaction) {

		const uwuify = new Uwuifier();
		const text = interaction.options.getString('text');
		const uwuText = uwuify.uwuifySentence(text);
		if (uwuText.length > 2000) {
			await interaction.deferReply();
			let uwuTextArray = [];
			for (let i = 0; i < uwuText.length; i += 2000) {
				uwuTextArray.push(uwuText.substring(i, i + 2000));
			}
			for (let i = 0; i < uwuTextArray.length; i++) {
				if (i === 0) {
					await interaction.editReply({content: uwuTextArray[i], allowedMentions: {repliedUser: false}});
				} else if (i % 4 === 0) {
					await interaction.channel.sendTyping();
					await new Promise(r => setTimeout(r, 1000));
				}
				if (i !== 0) {
					await interaction.followUp({ content: uwuTextArray[i], allowedMentions: { repliedUser: false  }});
				}

			}
		} else {
			await interaction.reply({ content: uwuText, allowedMentions: { repliedUser: false  }});
		}

	},
};
