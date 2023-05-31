const utils = require('../../utils.js');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const {errorAlert} = require("../../utils");

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        if (oldMember.premiumSince !== newMember.premiumSince) {
            // check if new user boost
            if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
                // Embed to send to log channel
                const embed = new EmbedBuilder()
                    .setColor(0xf47fff)
                    .setAuthor({
                        name: `${newMember.user.tag}`,
                        iconURL: `${newMember.user.avatarURL()}`
                    })
                    .setDescription(`**${newMember.user.tag}** just boosted the server!`)
                    .setTimestamp(new Date())
                    .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
                // Send embed to log channel
                await utils.sendEmbed('1087921223251542088', embed);
                // Send Embed to user
                const userEmbed = new EmbedBuilder()
                    .setColor(0xf47fff)
                    .setAuthor({
                        name: `${newMember.guild.name}`,
                        iconURL: `${newMember.guild.iconURL()}`
                    })
                    .setTitle(`Thank you for boosting ${newMember.guild.name}!`)
                    .setDescription(`You now have access to https://discord.com/channels/1087781906717872190/1092636697994469406 and the \`/booster\` command, which gives you a custom role.`)
                    .setTimestamp(new Date())
                    .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
                await utils.sendEmbedToUser(client, userEmbed, newMember.user.id);


            }
            // check if user removed boost
            else if (oldMember.premiumSince !== null && newMember.premiumSince === null) {
                // Embed to send to log channel
                const embed = new EmbedBuilder()
                    .setColor(0xf47fff)
                    .setAuthor({
                        name: `${newMember.user.tag}`,
                        iconURL: `${newMember.user.avatarURL()}`
                    })
                    .setDescription(`**${newMember.user.tag}** just removed their boost from the server!`)
                    .setTimestamp(new Date())
                    .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
                // Send embed to log channel
                await utils.sendEmbed(client, embed);

                // delete booster role
                const boosterRole = await utils.grabSpecialRole(newMember);
                if (boosterRole !== null) {
                    await boosterRole.delete();
                    // Send to log channel
                    const deletedRoleEmbed = new EmbedBuilder()
                        .setColor(0xf47fff)
                        .setAuthor({
                            name: `${newMember.user.tag}`,
                            iconURL: `${newMember.user.avatarURL()}`
                        })
                        .setDescription(`**${newMember.user.tag}** just removed their boost from the server, so I deleted their booster role.`)
                        .setTimestamp(new Date())
                        .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
                    await utils.sendEmbed(client, deletedRoleEmbed);

                }

            } else {
                await utils.errorAlert(`Error in guildMemberUpdate event for ${newMember.user.tag}:\n${err}`, "701", "Error in guildMemberUpdate event", "Miku");
            }
        }
        // logs nickname changes
        if (oldMember.nickname !== newMember.nickname) {
            let oldNick
            if (oldMember.nickname === null) {
                oldNick = oldMember.user.username
            } else {
                oldNick = oldMember.nickname
            }

            // Embed to send to log channel
            const embed = new EmbedBuilder()
                .setColor(0xabb524)
                .setAuthor({
                    name: `${newMember.user.tag}`,
                    iconURL: `${newMember.user.avatarURL()}`
                })
                .setDescription(`**${newMember.user.toString()}** just changed their nickname`)
                .addFields(
                    {name: 'Old Nickname', value: `${oldNick}`, inline: true},
                    {name: 'New Nickname', value: `${newMember.nickname}`, inline: true}
                )
                .setTimestamp(new Date())
                .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
            // Send embed to log channel
            await utils.sendEmbed(client, embed);
        }
    }

}