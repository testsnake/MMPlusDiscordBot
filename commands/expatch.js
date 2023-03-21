const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('expatch')
		.setDescription('ExPatch Download Link'),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/mods/388083'});
	},
};
