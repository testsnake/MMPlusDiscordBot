const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setNameLocalizations({
            'es-ES': 'vote_votar',
            fr: 'vote_voter',
            nl: 'vote_stemmen',
            'pt-BR': 'vote_votar',
            'zh-CN': 'vote_投票',
            ja: 'vote_投票',
            'zh-TW': 'vote_投票',
            ko: 'vote_투표',
        })
        .setDescription('vote for the current event')
        .setDescriptionLocalizations({
            de: 'Stimmen Sie für das aktuelle Ereignis ab',
            'en-GB': 'vote for the current event',
            'en-US': 'vote for the current event',
            'es-ES': 'vota por el evento actual',
            fr: 'votez pour l\'événement en cours',
            nl: 'stem voor het huidige evenement',
            'pt-BR': 'vote para o evento atual',
            'zh-CN': '为当前事件投票',
            ja: '現在のイベントに投票する',
            'zh-TW': '為當前事件投票',
            ko: '현재 이벤트에 투표하십시오',
        })
        .addStringOption(option =>
            option.setName('chart')
                .setDescription('the chart you want to vote on')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply("Voting hasn't started yet!");
    },
};

