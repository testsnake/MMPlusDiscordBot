const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mmm')
        .setDescription('Links Miku Miku Model')
        .setDescriptionLocalizations({
            de: 'Links zu Miku Miku Model',
            'en-GB': 'Links Miku Miku Model',
            'en-US': 'Links Miku Miku Model',
            'es-ES': 'Enlaces a Miku Miku Model',
            fr: 'Liens vers Miku Miku Model',
            nl: 'Links naar Miku Miku Model',
            'pt-BR': 'Links para Miku Miku Model',
            'zh-CN': '链接到 Miku Miku Model',
            ja: 'Miku Miku Modelへのリンク',
            'zh-TW': '鏈接到Miku Miku Model',
            ko: 'Miku Miku Model 링크',
        }),
    async execute(interaction) {
        await interaction.reply({ content: 'https://github.com/blueskythlikesclouds/MikuMikuLibrary/releases'});
    },
};
