const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const pm2Metrics = require('../../utils/pm2metrics.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('install')
		.setDescription('Mod installation guide')
		.setDescriptionLocalizations({
			de: 'Mod Installationsanleitung',
			'en-GB': 'Mod installation guide',
			'en-US': 'Mod installation guide',
			'es-ES': 'Guía de instalación de mods',
			fr: 'Guide d\'installation de mod',
			nl: 'Mod installatiegids',
			'pt-BR': 'Guia de instalação de mod',
			'zh-CN': '模组安装指南',
			ja: 'MEGA39\'s+モッドインストールガイド',
			'zh-TW': 'MEGA39\'s+模組安裝指南',
			ko: 'MEGA39\'s+ 모드 설치 가이드',
		})
		.setNameLocalizations({
			ja: 'インストール',
			ko: '설치',
			'zh-TW': '安裝',
			'zh-CN': '安装',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
		.setDMPermission(false),
	async execute(interaction) {
		pm2Metrics.actionsPerformed.inc();
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15379'});
	},
};
