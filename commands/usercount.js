const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usercount')
		.setNameLocalizations({
			de: 'benutzerzahl',
			'en-GB': 'usercount',
			'en-US': 'usercount',
			'es-ES': 'número-de-usuarios',
			fr: 'nombre-d-utilisateurs',
			nl: 'aantal-gebruikers',
			'pt-BR': 'número-de-usuários',
			'zh-CN': '用户数',
			ja: 'ユーザー数',
			'zh-TW': '用戶數',
			ko: '사용자-수',
		})
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
		}),
	async execute(interaction) {
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