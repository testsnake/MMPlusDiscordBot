const { loggingChannelId, mikuBotVer, botAvatarURL } = require('../../config.json');
const log  = require('../../logger.js');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        try {
            const loggingChannel = await client.channels.fetch(loggingChannelId);
            if (!loggingChannel) return;

            const embed = {
                color: parseInt('ff0000', 16),
                author: {
                    name: member.user.tag,
                    iconURL: member.user.avatarURL()
                },
                description: `**${member.user.tag} has left the server.**\nRoles: ${member.roles.cache.map(role => role.name).join(', ')}`,
                timestamp: new Date(),
                footer: {
                    text: mikuBotVer,
                    iconURL: botAvatarURL
                }
            };

            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in guildMemberRemove event:\n${err}`);

        }
    }
}