const log = require('../../utils/logger.js');
const { loggingChannelID, mikuBotVer, botAvatarURL } = require('../../config.json');
const { AuditLogEvent } = require('discord.js');
const {sendEmbed} = require("../../utils/utils");



module.exports = {
    name: 'guildBanRemove',
    async execute(guild, user, client) {
        try {


            // Loads the audit logs
            const auditLogs = await guild.fetchAuditLogs({
                type: AuditLogEvent.guildBanRemove,
                limit: 1
            });

            // Gets the audit log entry
            let logEntry;
            try {
                logEntry = await auditLogs.entries.first();
            } catch(err) {
                log.error(`Error getting audit log entry:\n${err}`);
            }

            const { action, executorId, targetId } = logEntry;



            const embed = {
                color: parseInt('00ff00', 16),
                author: {
                    name: user.tag,
                    iconURL: `${user.avatarURL()}`,
                },
                description: `**${user.tag} has been unbanned from the server by ${executorId.tag}**`,
                timestamp: new Date(),
                footer: {
                    text: mikuBotVer,
                    iconURL: botAvatarURL
                }
            };

            await sendEmbed(undefined, embed);
        } catch(err) {
            log.error(`Error in guildBanRemove event:\n${err}`);
        }
    }
}