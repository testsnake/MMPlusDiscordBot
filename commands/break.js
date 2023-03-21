const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('break')
		.setDescription('Information on the March Break'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'March Break', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.setDescription('In order to retain our sanity, we are going to take a break on development for the month of march.\n\nIn April, development on v5 will begin.')
			.setFooter({ text: `${mikuBotVer}`})
			.setTimestamp();
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
