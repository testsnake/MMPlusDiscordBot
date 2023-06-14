const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.setDescriptionLocalizations({
			de: 'Antwortet mit Pong!',
			'en-GB': 'Replies with Pong!',
			'en-US': 'Replies with Pong!',
			'es-ES': 'Responde con Pong!',
			fr: 'Répond avec Pong!',
			nl: 'Antwoordt met Pong!',
			'pt-BR': 'Responde com Pong!',
			'zh-CN': '回复 Pong!',
			ja: 'ポングと応答します!',
			'zh-TW': '回覆 Pong!',
			ko: 'Pong!으로 응답',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
		.setDMPermission(true),
	async execute(interaction) {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	},
};
