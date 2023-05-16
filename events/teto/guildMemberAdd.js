const { loggingChannelID, BotVer, botAvatarURL } = require('../../config.json');
const log = require('../../logger.js');
const { EmbedBuilder } = require('discord.js');
const { AuditLogEvent } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            const loggingChannel = await client.channels.fetch(loggingChannelID);
            if (!loggingChannel) return;

            const embed = new EmbedBuilder()
                .setColor('00ff00')
                .setAuthor({
                    name: `${member.user.tag}`,
                    iconURL: `${member.user.avatarURL()}`
                })
                .setDescription(`**${member.user.tag} has joined the server.\nUser Number: ${member.guild.memberCount}**`)
                .setTimestamp(new Date())
                .setFooter({text: BotVer, iconURL: botAvatarURL});



            loggingChannel.send({ embeds: [embed] });
        } catch(err) {
            log.error(`Error in guildMemberAdd event:\n${err.toString()}`);
        }
    }
}