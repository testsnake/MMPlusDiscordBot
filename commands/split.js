const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('split')
		.setDescription('Information on the splitting of Eden Project'),
	async execute(interaction) {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x86cecb)
			.setAuthor({ name: 'The Great Eden Project Split', iconURL: 'https://images.gamebanana.com/img/ico/games/6296031c71087.png'})
			.addFields(
				{ name: 'Who', value: 'The Eden Project Mod'},
				{ name: 'What', value: 'The Eden Project Mod will be split into a `core` mod, a `module` mod, and a bunch of song packs'},
				{ name: 'Where', value: 'GameBanana'},
				{ name: 'When', value: 'This is planned for Version 5 of Eden Project\nAs of Feb 23rd, 2023 we have not begun working on this, so stay tuned for updates'},
				{ name: 'Why', value: 'Eden Project hit 29.5GB with the release of version 4 and its just not sustainable for many users.\nWhile we have the lite version (!lite for info), its still 10GB which is a lot for a mod.'},
				{ name: 'How', value: 'I dunno'}
			)
			.setFooter({ text: `${mikuBotVer}`})
			.setTimestamp();

		await interaction.reply({ embeds: [helpEmbed] });
	},
};
