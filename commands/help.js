const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

const filePathU = './text/Utility.txt';
const textUtility = fs.readFileSync(filePathU, 'utf8');
const filePathT = './text/Troubleshooting.txt';
const textTroubleshooting = fs.readFileSync(filePathT, 'utf8');
const filePathF = './text/Fun.txt';
const textFun = fs.readFileSync(filePathF, 'utf8');
const filePathTemp = './text/Temp.txt';
const textTemp = fs.readFileSync(filePathTemp, 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives a list of avalible commands.'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'Command List', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.setDescription("Current list of commands. If you have any suggestions for commands, please contact testsnake#6663")
			.addFields(
				{ name: 'Utility', value: textUtility},
				{ name: 'Troubleshooting', value: textTroubleshooting},
				{ name: 'Fun', value: textFun},
				/*{ name: 'Temp', value: textTemp}*/
			)
			.setFooter({ text: `${mikuBotVer}`})
			.setTimestamp();
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
