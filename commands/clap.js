const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clap')
		.setDescription('Adds 👏 Clap 👏 Emoji 👏 in 👏 between 👏 each 👏 word.')
		.addStringOption(option => 
			option.setName('text')
				.setDescription('The text you want to add claps to.')
				.setRequired(true)),
	async execute(interaction) {
		const text = interaction.options.getString('text');
		const clapText = text.replace(/ /g, ' 👏 ')
		await interaction.reply({ content: clapText, allowedMentions: { repliedUser: false  }});
	},
};
