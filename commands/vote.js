const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setNameLocalizations({
            de: 'abstimmen',
            'en-GB': 'vote',
            'en-US': 'vote',
            'es-ES': 'votar',
            fr: 'voter',
            nl: 'stemmen',
            'pt-BR': 'votar',
            'zh-CN': '投票',
            ja: '投票',
            'zh-TW': '投票',
            ko: '투표',
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
                .setNameLocalizations({
                    de: 'Diagramm',
                    'en-GB': 'chart',
                    'en-US': 'chart',
                    'es-ES': 'gráfico',
                    fr: 'graphique',
                    nl: 'diagram',
                    'pt-BR': 'gráfico',
                    'zh-CN': '图表',
                    ja: 'チャート',
                    'zh-TW': '圖表',
                    ko: '차트',
                })
                .setDescription('the chart you want to vote on')
                .setDescriptionLocalizations({
                    de: 'Das Diagramm, für das Sie abstimmen möchten',
                    'en-GB': 'the chart you want to vote on',
                    'en-US': 'the chart you want to vote on',
                    'es-ES': 'el gráfico en el que quieres votar',
                    fr: 'le graphique sur lequel vous voulez voter',
                    nl: 'het diagram waarop u wilt stemmen',
                    'pt-BR': 'o gráfico em que você deseja votar',
                    'zh-CN': '您要投票的图表',
                    ja: '投票したいチャート',
                    'zh-TW': '您想投票的圖表',
                    ko: '투표하려는 차트',
                })
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply("Voting hasn't started yet!");
    },
};

