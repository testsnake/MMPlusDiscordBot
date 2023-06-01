const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRecentLogs } = require('../../logManager.js');
const { addLog } = require('../../logManager');
const { Client, Intents, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits} = require("discord.js");
const pm2Metrics = require('../../pm2metrics.js');
const { config } = require('../../config.json');
const log = require('../../logger.js');
const {sendEmbed, sendStarboardEmbed, ts} = require("../../utils");
const { getBotFromString } = require('../../bots.js');
const { getTimestamp, setFeedTimestamp, toggleFeed, manuallyProcessRecord} = require('../../gamebanana.js')




module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Dev commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('aamb')
                .setDescription('Act as miku bot')
                .addChannelOption(option => option.setName('channel').setDescription('Channel to send message to').setRequired(true))
                .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('Sends recent logs')
                .addIntegerOption(option => option.setName('count').setDescription('The number of logs to send.').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('addtostarboard')
                .setDescription('Manually add a message to the starboard')
                .addChannelOption(option => option.setName('channel').setDescription('The channel where the message is located').setRequired(true))
                .addStringOption(option => option.setName('message_id').setDescription('The ID of the message to be added to the starboard').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('giveallrole')
                .setDescription('Gives every single user a specified role.')
                .addRoleOption(option => option.setName('role').setDescription('The role you want to give to every user.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('setstatus')
                .setDescription('Sets the bot\'s status')
                .addStringOption(option =>
                    option.setName('status')
                        .setDescription('The new status for the bot')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type of the status (PLAYING, WATCHING, LISTENING, STREAMING, COMPETING)')
                        .setRequired(true)
                        .addChoices(
                            {name: 'Playing', value: 'Playing'},
                            {name: 'Watching', value: 'Watching'},
                            {name: 'Listening', value: 'Listening'},
                            {name: 'Streaming', value: 'Streaming'},
                            {name: 'Competing', value: 'Competing'}
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gamebanana')
                .setDescription('toggles the Gamebanana Feed'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('settimestamp')
                .setDescription('Sets the timestamp of the Gamebanana Feed')
                .addIntegerOption(option =>
                    option.setName('timestamp')
                        .setDescription('The timestamp to set the Gamebanana Feed to, defaults to current timestamp')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gettimestamp')
                .setDescription('Gets the timestamp of the Gamebanana Feed'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('addtofeed')
                .setDescription('Adds a post to the Gamebanana Feed manually')
                .addStringOption(option =>
                option.setName('subtype')
                    .setDescription('The type of post to add to the feed')
                    .setRequired(true)
                    .addChoices(
                        {name: 'mods', value: 'Mod'},
                        {name: 'requests', value: 'Request'},
                        {name: 'wips', value: 'Wip'},
                        {name: 'sounds', value: 'Sound'},
                        {name: 'questions', value: 'Question'},
                        {name: 'tutorial', value: 'Tut'},
                        {name: 'tools', value: 'Tool'},
                        {name: 'threads', value: 'Thread'},
                        {name: 'projects', value: 'Project'})
                )
                .addIntegerOption(option =>
                    option.setName('id')
                        .setDescription('The ID of the post to add to the feed')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('isnew')
                        .setDescription('Whether or not the post is new')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('viewmessagedetails')
                .setDescription('Gets the details of a message')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel where the message is located')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('The ID of the message to get details for')
                        .setRequired(true)))







        .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR)
        .setDMPermission(false),
    async execute(interaction) {
        const allowedUserId = '201460040564080651';
        if (interaction.user.id !== allowedUserId) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'aamb') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');
            if (!channel.isTextBased()) {
                return interaction.reply({ content: `Error: Channel must be a text channel.`, ephemeral: true });
            }
            await channel.sendTyping();
            await interaction.reply({ content: `Message sending.`, ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 4000));
            await channel.send(message);
            await interaction.editReply({ content: `Message sent.`, ephemeral: true });
        } else if (subcommand === 'logs') {
            const count = interaction.options.getInteger('count') || 10;
            const logs = await getRecentLogs(count);
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }
            await interaction.reply({ content: `Sending ${logs.length} logs.`, ephemeral: true });

            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

            let messagesSent = 0;
            await interaction.user.send({ content: `Sending ${logs.length} logs.`, ephemeral: true, allowedMentions: { repliedUser: false }});
            for (const log of logs) {
                await interaction.user.send({ content: `\`\`\`${log}\`\`\``, ephemeral: true, allowedMentions: { repliedUser: false }});
                messagesSent++;

                // If 5 messages have been sent, wait for 3 seconds before sending the next group
                if (messagesSent % 5 === 0) {
                    await sleep(3000);
                }
            }
            addLog(`Sent ${logs.length} logs to ${interaction.user.tag} (${interaction.user.id})`);
        } else if (subcommand === 'addtostarboard') {
            try {
                const channelId = interaction.options.getChannel('channel').id;
                const messageId = interaction.options.getString('message_id');

                await sendStarboardEmbed(messageId, channelId);
                await interaction.reply({ content: `Added message to starboard.`, ephemeral: true });
            } catch (error) {
                await interaction.reply({ content: `Error: ${error.message}`, ephemeral: true });
            }



        } else if (subcommand === 'giveallrole') {
            const targetRole = interaction.options.getRole('role');
            const guild = interaction.guild;

            // Check if the command user has administrator permissions.
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                return await interaction.reply({ content: 'You do not have permission to use this command.\nOnly users with the "Administrator" permission can give roles to all users.', ephemeral: true });
            }

            try {
                // Fetch all guild members
                await guild.members.fetch();

                // Iterate over each member and add the role
                guild.members.cache.each(async member => {
                    if (!member.roles.cache.has(targetRole.id) && !member.user.bot) {
                        await member.roles.add(targetRole);
                    }
                });

                return await interaction.reply(`The role ${targetRole} has been given to all users.`);
            } catch (error) {
                log.error(error);
                return await interaction.reply({ content: 'There was an error giving the role to all users. Please try again.', ephemeral: true });
            }
        } else if (subcommand === 'setstatus') {
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                return await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
            }

            const status = interaction.options.getString('status');
            const type = interaction.options.getString('type').toLowerCase();
            const activityType = type.charAt(0).toUpperCase() + type.slice(1);
            const validActivityTypes = Object.keys(ActivityType).filter(key => isNaN(parseInt(key)));
            if (!validActivityTypes.includes(activityType)) {
                return await interaction.reply({ content: `${activityType} Invalid activity type.`, ephemeral: true });
            }

            await interaction.client.user.setPresence({ activities: [{ name: `${status}`, type: ActivityType[activityType] }], status: 'online' });
            await interaction.reply({ content: `Status updated to: ${type}`, ephemeral: true });
        } else if (subcommand === 'gamebanana') {
            const feedStatus = await toggleFeed();
            await interaction.reply({ content: `The Gamebanana feed is now: ${feedStatus}`, ephemeral: true });
        } else if (subcommand === 'settimestamp') {
            const timestamp = interaction.options.getInteger('timestamp') || Math.floor(Date.now() / 1000);
            const setTimestamp = await setFeedTimestamp(timestamp);
            await interaction.reply({ content: `The timestamp has been set to: ${setTimestamp}`, ephemeral: true });
        } else if (subcommand === 'gettimestamp') {
            const timestamp = await getTimestamp();

            await interaction.reply({ content: `The current timestamp is: ${timestamp}, \<\t\:${timestamp}\:\F\>`, ephemeral: true });
        } else if (subcommand === 'addtofeed') {
            await interaction.deferReply({ ephemeral: true });
            const id = interaction.options.getInteger('id');
            const isNew = interaction.options.getBoolean('isnew');
            const subtype = interaction.options.getString('subtype');
            const status = await manuallyProcessRecord(subtype, id, isNew);
            await interaction.editReply({ content: `${status}` });

        } else if (subcommand === 'viewmessagedetails') {
            const messageId = interaction.options.getString('message_id');
            const channel = interaction.options.getChannel('channel');
            const message = await channel.messages.fetch(messageId);
            const embed = new MessageEmbed()
                .setTitle(`Message Details`)
                .setDescription(`Message ID: ${message.id}\nChannel: ${message.channel}\nAuthor: ${message.author}\nContent: ${message.content}`)
                .setColor(0x000000)
                .setTimestamp();
            // Puts every attachment link into a single field
            let attachments = '';
            message.attachments.forEach(attachment => {
                attachments += `${attachment.url}\n`;
            })
            if (attachments !== '') {
                embed.addField('Attachments', attachments);
            }
            if (message.editedAt) {
                embed.addField('Edited At', message.editedAt.toString());
            }
            if (message.flags.toArray().length > 0) {
                embed.addField('Flags', message.flags.toArray().join(', '));
            }
            if (message.applicationId) {
                embed.addField('Application ID', message.applicationId.toString());
            }
            if (message.activity) {
                embed.addField('Activity', message.activity.toString());
            }
            if (message.roleSubscriptionData) {
                embed.addField('Role Subscription Data', message.roleSubscriptionData.toString());
            }
            if (message.type) {
                embed.addField('Type', message.type.toString());
            }
            if (message.webhookId) {
                embed.addField('Webhook ID', message.webhookId.toString());
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });



        }

        else {
            await interaction.reply({ content: 'Invalid subcommand. Congrats on managing to do that, it shouldn\'t even be possible', ephemeral: true });
        }
    },
};
