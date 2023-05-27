const config = require('../../config.json');
const log  = require('../../utils/logger.js');
const { botVer, botAvatarURL } = require('../../config.json');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        try {
            if(oldMessage.author.bot) return;
            if(oldMessage.content === newMessage.content) return;
            const loggingChannel = await client.channels.fetch(config.loggingChannelID);
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
                    text: botVer,
                    iconURL: botAvatarURL
                }
            };

            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in messageUpdate event:\n${err}`);
        }
    }
}