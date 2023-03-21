const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getfile')
		.setDescription('Gets file from Eden Project')
		.addStringOption(option => 
			option.setName('text')
				.setDescription('The text you want to add claps to.')
				.setRequired(true)),
	async execute(interaction) {
		const text = interaction.options.getString('text');
		
		




		await interaction.reply({ content: clapText, allowedMentions: { repliedUser: false  }});
	},
};
