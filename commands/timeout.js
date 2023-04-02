const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, ActivityType } = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
const loggingChannel = '1087810388936114316';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Gives a user a timeout for a specified duration.')
        .addUserOption(option => option.setName('user').setDescription('The user to give a timeout.').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the timeout. (e.g., 10m, 1h)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the timeout.').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const loggingChannelId = '1087810388936114316'; // Replace with the ID of your logging channel

        const restrictedRoles = [
            '1087906708040466514',
            '1087782913199833158',
            '1087782822879690772'
        ];
        try {
            if (!interaction.member.roles.cache.has('1087782913199833158') && !interaction.member.permissions.has('ADMINISTRATOR')) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }
        } catch (error) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user);

            const hasRestrictedRole = restrictedRoles.some(role => member.roles.cache.has(role));

            if (hasRestrictedRole) {
                return await interaction.reply({ content: 'You cannot give a timeout to a user with a protected role.', ephemeral: true });
            }

            await member.timeout(5 * 60 * 1000, reason);
            await interaction.reply({ content: `${user.tag} has been given a timeout for ${duration}. Reason: ${reason}`, ephemeral: true });

            const loggingChannel = await interaction.client.channels.fetch(loggingChannelId);
            if (loggingChannel) {
                loggingChannel.send(`${user.tag} has been given a timeout by ${interaction.user.tag} for ${duration}. Reason: ${reason}`);
            }

        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error giving the user a timeout. Please try again.', ephemeral: true });
        }
    },
};
