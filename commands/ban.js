const { SlashCommandBuilder } = require('@discordjs/builders');
const banRequests = require('../banRequests');
const { Client, Intents, ActivityType, ActionRow, ActionRowBuilder, ButtonBuilder} = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
const { MessageActionRow, MessageButton } = require('discord.js');
const loggingChannel = '1087810388936114316';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => option.setName('user').setDescription('The user to ban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban.').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';



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
                return await interaction.reply({ content: 'You cannot ban a user with a protected role.', ephemeral: true });
            }
            banRequests.clearExpiredRequests();
            const isConfirmed = banRequests.addRequest(user, interaction.user);

            if (isConfirmed) {
                await interaction.reply({ content: `${user.tag} has been banned. Reason: ${reason}`, ephemeral: true });
                await member.ban({ reason: reason });

            } else {

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${interaction.user.tag}_ban_confirm_${user.id}`)
                            .setLabel('Yes')
                            .setStyle('Success'),
                        new ButtonBuilder()
                            .setCustomId(`${interaction.user.tag}_ban_cancel_${user.id}`)
                            .setLabel('No')
                            .setStyle('Danger')
                    );

                // Send the message to the specified channel
                const channel = interaction.guild.channels.cache.get('1089338656017350796');
                await channel.send({ content: `${interaction.user.toString()} wants to ban ${user.tag.toString()} for ***${reason}***`, components: [row] });
                await interaction.reply({ content: `Ban request for ${user.tag} is pending. A second moderator needs to confirm the ban.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error banning the user. Please try again.', ephemeral: true });
        }
    },
};
