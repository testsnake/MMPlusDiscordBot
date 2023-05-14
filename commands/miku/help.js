const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const pm2Metrics = require('../../pm2metrics.js');
const config = require('../../config.json');

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
		.setDescription('Gives a list of available commands.')
		.setDescriptionLocalizations({
			de: 'Gibt eine Liste der verfügbaren Befehle aus. (Engl.)',
			'en-GB': 'Gives a list of available commands.',
			'en-US': 'Gives a list of available commands.',
			fr: 'Donne une liste des commandes disponibles. (Angl.)',
			nl: 'Geeft een lijst van beschikbare commando\'s. (Engels)',
			'pt-BR': 'Fornece uma lista de comandos disponíveis. (Inglês)',
			'zh-CN': '提供可用命令的列表。 （英语）',
			ja: '使用可能なコマンドのリストを提供します。 （英語）',
			'zh-TW': '提供可用命令的列表。 （英語）',
			ko: '사용 가능한 명령 목록을 제공합니다. (영어)',
			"es-ES": "Proporciona una lista de comandos disponibles. (Inglés)"
		})
		.setNameLocalizations({
			de: 'hilfe',
			'en-GB': 'help',
			'en-US': 'help',
			fr: 'aide',
			nl: 'help',
			'pt-BR': 'ajuda',
			'zh-CN': '帮助',
			ja: 'ヘルプ',
			'zh-TW': '幫助',
			ko: '도움말',
			"es-ES": "ayuda"
		}),
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
		const boosterRole = interaction.member.roles.cache.has(`${config.boosterRole.global[0]}`)
		if (boosterRole) {
			helpEmbed.addFields(
				{ name: 'Booster', value: textBooster}
			)
		}
		const modRole = interaction.member.roles.cache.has(`${config.modRoleID}`)
		const adminRole = interaction.member.roles.cache.has(`${config.adminRoleID}`)
		if (modRole || adminRole) {
			helpEmbed.addFields(
				{ name: 'Admin', value: textAdmin}
			)
		}

		await interaction.reply({ embeds: [helpEmbed] });
	},
};
