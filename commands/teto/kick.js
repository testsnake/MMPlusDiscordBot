const { SlashCommandBuilder } = require('@discordjs/builders');
const kickRequests = require('../../kickRequests');
const { Client, Intents, ActivityType, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits} = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .setDescriptionLocalizations({
            de: 'Kickt einen Benutzer vom Server.',
            'en-GB': 'Kick a user from the server.',
            'en-US': 'Kick a user from the server.',
            'es-ES': 'Expulsa a un usuario del servidor.',
            fr: 'Expulsez un utilisateur du serveur.',
            nl: 'Schop een gebruiker van de server.',
            'pt-BR': 'Expulse um usuário do servidor.',
            'zh-CN': '从服务器中踢出用户。',
            ja: 'サーバーからユーザーをキックします。',
            'zh-TW': '從伺服器中踢出用戶。',
            ko: '사용자를 서버에서 킥합니다.',
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.MODERATE_MEMBERS)
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick.').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const allowedRole = '1087782913199833158';
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

            kickRequests.clearExpiredRequests();
            const isConfirmed = kickRequests.addRequest(user, interaction.user);

            if (isConfirmed) {
                await member.kick(reason);
                await interaction.reply({ content: `${user.tag} has been kicked. Reason: ${reason}`, ephemeral: true });
            } else {

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${interaction.user.tag}_kick_confirm_${user.id}`)
                            .setLabel('Yes')
                            .setStyle('Success'),
                        new ButtonBuilder()
                            .setCustomId(`${interaction.user.tag}_kick_cancel_${user.id}`)
                            .setLabel('No')
                            .setStyle('Danger')
                    );

                // Send the message to the specified channel
                const channel = interaction.guild.channels.cache.get('1092866838918086666');
                await channel.send({ content: `${interaction.user.toString()} wants to kick ${user.tag.toString()} for ***${reason}***`, components: [row] });
                await interaction.reply({ content: `Kick request for ${user.tag} is pending. A second moderator needs to confirm the kick.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error kicking the user. Please try again.', ephemeral: true });
        }
    },
};