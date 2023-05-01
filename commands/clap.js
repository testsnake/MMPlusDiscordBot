const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clap')
		.setDescription('Adds 👏 Clap 👏 Emoji 👏 in 👏 between 👏 each 👏 word.')
		.setNameLocalizations({
			'zh-CN': '鼓掌',
			ja: '拍手',
			'zh-TW': '鼓掌',
			ko: '박수',
		})
		.setDescriptionLocalizations({
			de: 'Fügt 👏 Klatsch-Emoji 👏 zwischen 👏 jedes 👏 Wort 👏 ein.',
			'en-GB': 'Adds 👏 Clap 👏 Emoji 👏 in 👏 between 👏 each 👏 word.',
			'en-US': 'Adds 👏 Clap 👏 Emoji 👏 in 👏 between 👏 each 👏 word.',
			'es-ES': 'Agrega 👏 el 👏 emoji 👏 de 👏 aplausos 👏 entre 👏 cada 👏 palabra.',
			fr: 'Ajoute 👏 l\'emoji 👏 de 👏 la 👏 claque 👏 entre 👏 chaque 👏 mot.',
			nl: 'Voegt 👏 Klappende 👏 Emoji\'s 👏 tussen 👏 elk 👏 woord 👏 toe.',
			'pt-BR': 'Adiciona 👏 o emoji 👏 de 👏 palmas 👏 entre 👏 cada 👏 palavra.',
			'zh-CN': '在每个单词之间添加鼓掌表情。',
			ja: '各単語の間に拍手絵文字を追加します。',
			'zh-TW': '在每個單詞之間添加鼓掌表情符號。',
			ko: '각 👏 단어 👏 사이에 👏 박수 👏 이모지를 👏 추가합니다.',
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
						'zh-TW': '文字',
						ko: '텍스트',
					})
					.setDescription('The text you want to add claps to.')
					.setDescriptionLocalizations({
						de: 'Der Text, zu dem Sie Klatschen hinzufügen möchten.',
						'en-GB': 'The text you want to add claps to.',
						'en-US': 'The text you want to add claps to.',
						'es-ES': 'El texto al que deseas agregar aplausos.',
						fr: 'Le texte auquel vous voulez ajouter des applaudissements.',
						nl: 'De tekst waar u klappen aan wilt toevoegen.',
						'pt-BR': 'O texto ao qual você deseja adicionar palmas.',
						'zh-CN': '您想要添加鼓掌的文本。',
						ja: '拍手を追加したいテキスト。',
						'zh-TW': '您想要添加鼓掌的文字。',
						ko: '박수를 추가하려는 텍스트입니다.',
					})

					.setRequired(true)),
	async execute(interaction) {
		const text = interaction.options.getString('text');
		const clapText = text.replace(/ /g, ' 👏 ')
		await interaction.reply({ content: clapText, allowedMentions: { repliedUser: false  }});
	},
};
