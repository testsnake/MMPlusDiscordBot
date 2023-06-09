const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const pm2Metrics = require('../../pm2metrics.js');
const { config } = require('../../config.json');
const log = require('../../logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usercount')
		.setDescription('Number of users in server')
		.setDescriptionLocalizations({
			de: 'Anzahl der Benutzer im Server',
			'en-GB': 'Number of users in server',
			'en-US': 'Number of users in server',
			'es-ES': 'Número de usuarios en el servidor',
			fr: 'Nombre d\'utilisateurs dans le serveur',
			nl: 'Aantal gebruikers in de server',
			'pt-BR': 'Número de usuários no servidor',
			'zh-CN': '服务器中的用户数',
			ja: 'サーバー内のユーザー数',
			'zh-TW': '伺服器中的用戶數',
			ko: '서버의 사용자 수',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
		.setDMPermission(false),
	async execute(interaction) {
		pm2Metrics.actionsPerformed.inc();
		const guild = interaction.guild;
  		const memberCount = guild.memberCount;
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'Member Count', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.setDescription(`The guild has ${memberCount} members.`)
			.setFooter({ text: `${mikuBotVer}`});

		await interaction.reply({ embeds: [helpEmbed] });
	},
};