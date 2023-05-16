const { loggingChannelID, mikuBotVer, botAvatarURL } = require('../../config.json');
const log  = require('../../logger.js');
const {AuditLogEvent, Events} = require("discord.js");

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client, guild) {
        try {
            const loggingChannel = await client.channels.fetch(loggingChannelID);
            if (!loggingChannel) return;

            const auditLogs = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.guildMemberRemove,
                limit: 1
            })



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

            // checks if the user was kicked
            if (auditLogs.entries.first().action === 'MEMBER_KICK') {
                const { executor } = auditLogs.entries.first();
                embed.description += `\nKicked by: ${executor.tag}`;
            }

            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in guildMemberRemove event:\n${err}`);

        }
    }
}