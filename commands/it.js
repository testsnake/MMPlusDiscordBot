const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('it')
		.setDescription('Asks for basic Diagnostic Info'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'Send screenshots of', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.setDescription('- your mods folder\n- Eden project folder in the mods folder\n- config.toml in the Eden project folder\n- right click on the Eden project folder, select properties, and screenshot that')
			.setFooter({ text: `${mikuBotVer}`});
		await interaction.reply({ embeds: [helpEmbed] });
	},
};