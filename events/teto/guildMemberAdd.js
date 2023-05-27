const { loggingChannelID, botVer, botAvatarURL } = require('../../config.json');
const log = require('../../utils/logger.js');
const { EmbedBuilder } = require('discord.js');
const { sendEmbed } = require('../../utils/utils.js');


module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {


            const embed = new EmbedBuilder()
                .setColor('00ff00')
                .setAuthor({
                    name: `${member.user.tag}`,
                    // iconURL: `${member.user.avatarURL()}`
                })
                .setDescription(`**${member.user.tag} has joined the server.\nUser Number: ${member.guild.memberCount}**`)
                .setTimestamp(new Date())
                .setFooter({text: `${botVer}`});


            await sendEmbed(undefined, embed);

        } catch (err) {
            if (Array.isArray(err.errors)) {
                for (let error of err.errors) {
                    log.error(`Error in guildMemberAdd event:\n${error}`);
                }
            } else {
                log.error(`Error in guildMemberAdd event:\n${err}`);
            }
        }


    }
}