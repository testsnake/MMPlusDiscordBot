const log = require('../../logger.js');
const { loggingChannelID, mikuBotVer, botAvatarURL } = require('../../config.json');



module.exports = {
    name: 'guildBanRemove',
    async execute(guild, user, client) {
        try {
            const loggingChannel = await client.channels.fetch(loggingChannelID);
            if (!loggingChannel) return;

            const embed = {
                color: parseInt('00ff00', 16),
                author: {
                    name: user.tag,
                    iconURL: user.avatarURL()
                },
                description: `**${user.tag} has been unbanned from the server.**`,
                timestamp: new Date(),
                footer: {
                    text: mikuBotVer,
                    iconURL: botAvatarURL
                }
            };

            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in guildBanRemove event:\n${err}`);
        }
    }
}