const utils = require('../../utils.js');
const log = require('../../logger.js');
const config = require('../../config.json');
const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const util = require("util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user to the staff team.')
        .addStringOption(option =>
            option.setName('rule')
                .setDescription('Which rule was broken?')
                .setRequired(true)
                .addChoices(
                    {name: 'Rule 1 - Treat everyone with respect', value: '1'},
                    {name: 'Rule 2 - No NSFW', value: '2'},
                    {name: 'Rule 3 - Offtopic', value: '3'},
                    {name: 'Rule 4 - Causing Drama', value: '4'},
                    {name: 'Rule 5 - Be nice to people who are learning', value: '5'},
                    {name: 'Rule 7 - Spamming', value: '7'},
                    {name: 'Rule 8 -Piracy', value: '8'},
                    {name: 'Rule 9 - Other', value: '9'},
                    {name: 'Rule 10 - Channel Specific Rules', value: '10'},
                )
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to report')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message ID or link to message')
                .setRequired(false)
        )
        .addStringOption(option =>
        option.setName('context')
            .setDescription('any additional context')
            .setRequired(false)
    ),
    async execute(interaction) {
        try {
            const rule = interaction.options.getString('rule');
            const user = interaction.options.getUser('user');
            const message = interaction.options.getString('message');
            const context = interaction.options.getString('context');
            const reportingUser = interaction.user;

            // Attempts to get the message from the message ID then tries to get the message from the link
            let msg;
            try {
                msg = await interaction.channel.messages.fetch(message);
            } catch (err) {
                log.debug(`Error fetching message from ID: ${err}`);
            }
            if (!msg) {
                try {
                    msg = await interaction.channel.messages.fetch(message.split('/').pop());
                } catch (err) {
                    log.debug(`Error fetching message from link: ${err}`);
                }
            }

            const reportEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`Report for ${user.toString()}`)
                .setAuthor({
                    name: `${reportingUser.toString()}`,
                    iconURL: `${reportingUser.avatarURL()}`
                })

            if (rule) {
                reportEmbed.addFields({name: 'Rule', value: `${rule}`});
            }
            let deleteMessageButton;
            let actionRow;
            if (msg) {
                reportEmbed.addFields({name: 'Message', value: `${msg.url}`});
                const buttonID = `deleteMessage-${msg.id}`
                deleteMessageButton = new ButtonBuilder()
                    .setCustomId(buttonID)
                    .setLabel('Delete Message')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🗑️')



                utils.addButton(buttonID, async (interaction) => {
                    await interaction.deferUpdate();
                    try {
                        await msg.delete();
                        await interaction.editReply({content: 'Message deleted', components: []});
                    } catch (err) {
                        log.error(`Error deleting message:\n${err}`);
                        await interaction.editReply({content: 'There was an error deleting the message', components: []});
                    }
                })

                const linkToMessageButton = new ButtonBuilder()
                    .setLabel('Link to Message')
                    .setStyle(ButtonStyle.Link)
                    .setURL(msg.url)
                    .setEmoji('🔗')

                actionRow = new ActionRowBuilder()
                    .addComponents(deleteMessageButton)
                    .addComponents(linkToMessageButton)








            }
            if (context) {
                reportEmbed.addFields({name: 'Context', value: `${context}`});
            }
            reportEmbed.setTimestamp(new Date())
                .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});

            const reportChannel = interaction.guild.channels.cache.get(config.reportChannelID);

            await reportChannel.send({embeds: [reportEmbed], components: [actionRow]});
            await interaction.reply({content: 'Report sent', ephemeral: true});


        } catch (err) {
            log.error(`Error in report command:\n${err}`);
            interaction.reply({content: 'There was an error in the report command. Please use /ticket or DM a moderator', ephemeral: true});
        }




    }



}