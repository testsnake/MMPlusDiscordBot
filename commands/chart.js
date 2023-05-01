const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chart')
		.setDescription('Comfy Charting Manual')
		.setDescriptionLocalizations({
			de: 'Comfy Charting-Handbuch',
			'en-GB': 'Comfy Charting Manual',
			'en-US': 'Comfy Charting Manual',
			'es-ES': 'Manual de Charting Comfy',
			fr: 'Manuel de Charting Comfy',
			nl: 'Comfy Charting Handleiding',
			'pt-BR': 'Manual de Charting Comfy',
			'zh-CN': 'Comfy 绘图手册',
			ja: 'Comfy 譜面マニュアル',
			'zh-TW': 'Comfy 繪圖手冊',
			ko: 'Comfy 차팅 매뉴얼',
		}),
	async execute(interaction) {
		await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/603835223691624451/1038680701668696105/image.png'});
	},
};
