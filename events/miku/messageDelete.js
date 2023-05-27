const {addLog} = require("../../utils/logManager");
const log = require('../../utils/logger.js');
const config = require('../../config.json');
const { botVer, botAvatarURL } = require('../../config.json');
const { AuditLogEvent, Events, EmbedBuilder} = require('discord.js');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        try {
            const loggingChannel = await client.channels.fetch(config.loggingChannelID);
            if (!loggingChannel) return;


            // Fetch the audit logs for the guild.
            const auditLogs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MessageDelete,
                limit: 1
            });


            const { action, extra: channel, executorId, targetId } = auditLogs;

            // Check only for deleted messages.

            let executor
            // Ensure the executor is cached.
            try {
                executor = await client.users.fetch(executorId);
            } catch(err) {
                log.info(`Error getting executor:\nExecutor was probably the author\n${err}`);
            }


            if (action !== AuditLogEvent.MessageDelete)
            {
                executor = message.author;
            }




            // const embed = {
            //     color: parseInt('ff0000', 16),
            //     author: {
            //         name: message.author.tag,
            //         iconURL: message.author.avatarURL()
            //     },
            //     title: '**Message deleted in ${message.channel}**',
            //     description: `ID: ${message.id}\n${message.content}`,
            //     timestamp: new Date(),
            //     fields: [
            //         {name: "Author", value: message.author.tag, inline: true},
            //         {name: "MessageID", value: message.id, inline: true},
            //         {name: "Deleted by", value: executorId.tag, inline: true},
            //     ],
            //     footer: {
            //         text: botVer,
            //         iconURL: botAvatarURL
            //     }
            // };

            const embed = new EmbedBuilder()
                .setColor(parseInt('ff0000', 16))
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.avatarURL()})
                .setTitle(`**Message deleted in ${message.channel}**`)
                .setDescription(`ID: ${message.id}\n${message.content}`)
                .setTimestamp(new Date())
                .addFields({name: "Author", value: `${message.author.toString()}`, inline: true})
                .addFields({name: "MessageID", value: `${message.id}`, inline: true})
                // .addFields({name: "Deleted by", value: `${executor.toString()}`, inline: true})

                .setFooter({text: `${botVer}`, iconURL: `${botAvatarURL}`});

            // log.info(JSON.stringify(embed));
            // log.info(JSON.stringify(embed.toJSON()));

            //adds attachment field if message has attachment(s)
            if (message.attachments.size > 0) {
                let attachmentString = "";
                message.attachments.forEach(attachment => {
                    attachmentString += `${attachment.url}\n`;
                });
                embed.addField({name: "Attachments", value: attachmentString});
            }

            addLog(`[MESSAGE DELETE] ${message.author.username} deleted a message in ${message.channel.name} at ${new Date()}.`);
            log.info(`[MESSAGE DELETE] ${message.author.username} deleted a message in ${message.channel.name} at ${new Date()}.`);
            loggingChannel.send({ embeds: [embed] });

        } catch(err) {
            log.error(`Error in messageDelete event:\n${err}`);
        }
    },
}