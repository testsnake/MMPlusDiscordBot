const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mfx')
		.setDescription('projectmfx folder fix'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'Out of date mod', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.addFields(
				{ name: 'What', value: 'You\'re on an Significantly out of date version of Eden Project'},
				{ name: 'How to Fix', value: 'Delete the projectmfx Folder, as there is no way to update it to the current version\n\nDon\'t worry, your savedata will not be erased\nNow redownload Eden Project'}
				
			)
			.setFooter({ text: `${mikuBotVer}`});
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
