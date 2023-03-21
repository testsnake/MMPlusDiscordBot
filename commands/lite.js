const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lite')
		.setDescription('Information on lite mode'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'Eden Project Lite Version', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png', url: 'https://gamebanana.com/mods/427167'})
			.setDescription('In order to save storage space (19 GB), Eden Project Lite Version does NOT have the pre-rendered physics data that Project Diva requires for Edit 3DPVs\n\nAs a result, stuff looks weird')
			.setImage('https://cdn.discordapp.com/attachments/1008978799989362808/1074555135675609139/lite_Version.gif')
			.setFooter({ text: `${mikuBotVer}`});
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
