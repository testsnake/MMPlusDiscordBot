const { SlashCommandBuilder } = require('discord.js');

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
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://gamebanana.com/tuts/15379'});
	},
};
