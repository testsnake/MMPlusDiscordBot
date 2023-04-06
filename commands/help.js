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
const filePathBooster = './text/Booster.txt';
const textBooster = fs.readFileSync(filePathBooster, 'utf8')
const filePathAdmin = './text/Admin.txt';
const textAdmin = fs.readFileSync(filePathAdmin, 'utf8')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives a list of avalible commands.'),
	async execute(interaction) {
		let helpEmbed = new EmbedBuilder()
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
		if (interaction.member.roles.cache.has('1092636310142980127')) {
			helpEmbed.addFields(
				{ name: 'Booster', value: textBooster}
			)
		}
		const modRole = interaction.member.roles.cache.has('1087782913199833158')
		const adminRole = interaction.member.roles.cache.has('1087782822879690772')
		if (modRole || adminRole) {
			helpEmbed.addFields(
				{ name: 'Admin', value: textAdmin}
			)
		}

		await interaction.reply({ embeds: [helpEmbed] });
	},
};
