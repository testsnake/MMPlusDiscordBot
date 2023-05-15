const {addLog} = require("../../logManager");
const log = require('../../logger.js');
const config = require('../../config.json');
const { botVer, botAvatarURL } = require('../../config.json');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        try {
            const loggingChannel = await client.channels.fetch(config.loggingChannelID);
            if (!loggingChannel) return;

            const embed = {
                color: parseInt('ff0000', 16),
                author: {
                    name: message.author.tag,
                    iconURL: message.author.avatarURL()
                },
                description: `**Message deleted in ${message.channel}**\nID: ${message.id}\n${message.content}`,
                timestamp: new Date(),
                footer: {
                    text: botVer,
                    iconURL: botAvatarURL
                }
            };
            addLog(`[MESSAGE DELETE] ${message.author.username} deleted a message in ${message.channel.name} at ${new Date()}.`);
            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in messageDelete event:\n${err}`);
        }
    },
}