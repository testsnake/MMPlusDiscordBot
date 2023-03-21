const { SlashCommandBuilder } = require('discord.js');
const Uwuifier = require('uwuifier').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uwu')
		.setDescription('Uwu-ify your text!')
		.addStringOption(option => 
			option.setName('text')
				.setDescription('The text you want to uwu-ify.')
				.setRequired(true)),
	async execute(interaction) {

		const uwuify = new Uwuifier();
		const text = interaction.options.getString('text');
		const uwuText = uwuify.uwuifySentence(text);
		await interaction.reply({ content: uwuText, allowedMentions: { repliedUser: false  }});
	},
};
