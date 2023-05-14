const { loggingChannelId, mikuBotVer, botAvatarURL } = require('../../config.json');
const log  = require('../../logger.js');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        try {
            if(oldMessage.author.bot) return;
            if(oldMessage.content === newMessage.content) return;
            const loggingChannel = await client.channels.fetch(loggingChannelId);
            if (!loggingChannel) return;

            const embed = {
                color: parseInt("ffff00", 16),
                author: {
                    name: oldMessage.author.tag,
                    iconURL: oldMessage.author.avatarURL()
                },
                fields: [
                    {
                        name: 'Original Message',
                        value: oldMessage.content
                    },
                    {
                        name: 'Edited Message',
                        value: newMessage.content
                    },
                    {
                        name: 'Channel',
                        value: oldMessage.channel.toString()
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: mikuBotVer,
                    iconURL: botAvatarURL
                }
            };

            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in messageUpdate event:\n${err}`);
        }
    }
}