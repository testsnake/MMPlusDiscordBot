const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const pm2Metrics = require('../../utils/pm2metrics.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dml')
        .setDescription('Diva Mod Loader link')
        .setNameLocalizations({
            ja: 'dmlリンク',
            ko: 'dml링크',
            'zh-TW': 'dml連結',
            'zh-CN': 'dml链接',

        })
        .setDescriptionLocalizations({
            de: 'Diva Mod Loader Link',
            'en-GB': 'Diva Mod Loader link',
            'en-US': 'Diva Mod Loader link',
            'es-ES': 'Enlace de Diva Mod Loader',
            fr: 'Lien Diva Mod Loader',
            nl: 'Diva Mod Loader-link',
            'pt-BR': 'Link do Diva Mod Loader',
            'zh-CN': 'Diva Mod Loader 链接',
            ja: 'Diva Mod Loader リンク',
            'zh-TW': 'Diva Mod Loader 連結',
            ko: 'Diva Mod Loader 링크',
        }),

    async execute(interaction) {
        pm2Metrics.actionsPerformed.inc();
        await interaction.reply({ content: 'https://github.com/blueskythlikesclouds/DivaModLoader/releases'});
    },
};
