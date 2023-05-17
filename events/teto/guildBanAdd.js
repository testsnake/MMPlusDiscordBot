const log = require('../../logger.js');
const { loggingChannelID, mikuBotVer, botAvatarURL } = require('../../config.json');
const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'guildBanAdd',
    async execute(guild, user, client) {
        try {
            const loggingChannel = await client.channels.fetch(loggingChannelID);
            if (!loggingChannel) return;

            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.guildBanAdd,
                limit: 1
            })

            let logEntry;
            try {
                logEntry = auditLogs.entries.first()
            } catch(err) {
                log.error(`Error getting audit log entry:\n${err}`)
            }

            let reason = 'unknown';
            if (logEntry) {
                const { executor, reason: banReason } = logEntry;
                if (executor) {
                    reason = banReason || 'unknown';
                    reason += `\nBanned by: ${executor.tag}`;
                }
            }

            const embed = {
                color: parseInt('ff0000', 16),
                author: {
                    name: user.tag,
                    iconURL: user.avatarURL()
                },
                description: `**${user.tag} has been banned from the server.**\nReason: ${reason}`,
                timestamp: new Date(),
                footer: {
                    text: mikuBotVer,
                    iconURL: botAvatarURL
                }
            };
            log.info(`[BAN] ${user.tag} has been banned from the server.`);
            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in guildBanAdd event:\n${err}`);
        }
    }
}