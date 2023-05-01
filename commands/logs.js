const { SlashCommandBuilder } = require('discord.js');
const { getRecentLogs } = require('../logManager.js');
const {addLog} = require("../logManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Sends recent logs')
        .setDescriptionLocalizations({
            de: 'Sendet die neuesten Logs',
            'en-GB': 'Sends recent logs',
            'en-US': 'Sends recent logs',
            'es-ES': 'Envía registros recientes',
            fr: 'Envoie les journaux récents',
            nl: 'Stuurt recente logs',
            'pt-BR': 'Envia logs recentes',
            'zh-CN': '发送最近的日志',
            ja: '最近のログを送信します',
            'zh-TW': '發送最近的日誌',
            ko: '최근 로그를 보냅니다',
        })
        .setNameLocalizations({
            ja: 'ログ',
            ko: '로그',
            'zh-TW': '日誌',
            'zh-CN': '日志',
            "en-GB": "logs",
            "en-US": "logs",
            "es-ES": "logs",
            "fr": "logs",
            "nl": "logs",
            "pt-BR": "logs",
            "de": "logs",
        })
        .addIntegerOption(option => option.setName('count').setDescription('The number of logs to send.').setRequired(false)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count') || 10;
        const logs = await getRecentLogs(count);
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        await interaction.reply({ content: `Sending ${logs.length} logs.`, ephemeral: true });

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        let messagesSent = 0;
        await interaction.user.send({ content: `Sending ${logs.length} logs.`, ephemeral: true, allowedMentions: { repliedUser: false }});
        for (const log of logs) {
            await interaction.user.send({ content: `\`\`\`${log}\`\`\``, ephemeral: true, allowedMentions: { repliedUser: false }});
            messagesSent++;

            // If 5 messages have been sent, wait for 3 seconds before sending the next group
            if (messagesSent % 5 === 0) {
                await sleep(3000);
            }
        }
        addLog(`Sent ${logs.length} logs to ${interaction.user.tag} (${interaction.user.id})`);
    }
}