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
        .setNameLocalizations({
            de: 'ban',
            'en-GB': 'ban',
            'en-US': 'ban',
            'es-ES': 'prohibir',
            fr: 'bannir',
            nl: 'ban',
            'pt-BR': 'banir',
            'zh-CN': '禁止',
            ja: '禁止',
            'zh-TW': '禁止',
            ko: '금지',
        })
        .setDescription('Ban a user from the server.')
        .setDescriptionLocalizations({
            de: 'Bannt einen Benutzer vom Server.',
            'en-GB': 'Ban a user from the server.',
            'en-US': 'Ban a user from the server.',
            'es-ES': 'Prohibir a un usuario del servidor.',
            fr: 'Bannir un utilisateur du serveur.',
            nl: 'Ban een gebruiker van de server.',
            'pt-BR': 'Banir um usuário do servidor.',
            'zh-CN': '将用户从服务器中封禁。',
            ja: 'サーバーからユーザーをBANします。',
            'zh-TW': '將用戶從伺服器中封禁。',
            ko: '서버에서 사용자를 밴합니다.',
        })
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to ban.')
            .setNameLocalizations({
            de: 'benutzer',
            'en-GB': 'user',
            'en-US': 'user',
            'es-ES': 'usuario',
            fr: 'utilisateur',
            nl: 'gebruiker',
            'pt-BR': 'do-utilizador',
            'zh-CN': '用户',
            ja: 'ユーザー',
            'zh-TW': '用戶',
            ko: '사용자',
            })
            .setDescriptionLocalizations({
            de: 'Der Benutzer, der gebannt werden soll.',
            'en-GB': 'The user to ban.',
            'en-US': 'The user to ban.',
            'es-ES': 'El usuario a prohibir.',
            fr: 'L\'utilisateur à bannir.',
            nl: 'De gebruiker om te bannen.',
            'pt-BR': 'O usuário a ser banido.',
            'zh-CN': '要封禁的用户。',
            ja: 'BANするユーザー。',
            'zh-TW': '要封禁的用戶。',
            ko: '밴할 사용자.',
            }).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban.').setDescriptionLocalizations({
            de: 'Der Grund für das Verbot.',
            'en-GB': 'The reason for the ban.',
            'en-US': 'The reason for the ban.',
            'es-ES': 'La razón de la prohibición.',
            fr: 'La raison de l\'interdiction.',
            nl: 'De reden voor de ban.',
            'pt-BR': 'O motivo do banimento.',
            'zh-CN': '封禁的原因。',
            ja: 'BANの理由。',
            'zh-TW': '封禁的原因。',
            ko: '밴 사유.',
        }).setRequired(false)),
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
                            .setLabel('Confirm')
                            .setStyle('Danger'),
                        new ButtonBuilder()
                            .setCustomId(`${interaction.user.tag}_ban_cancel_${user.id}`)
                            .setLabel('Cancel')
                            .setStyle('Secondary')
                    );

                // Send the message to the specified channel
                const channel = interaction.guild.channels.cache.get('1092866838918086666');
                await channel.send({ content: `${interaction.user.toString()} wants to ban ${user.tag.toString()} for ***${reason}***`, components: [row] });
                await interaction.reply({ content: `Ban request for ${user.tag} is pending. A second moderator needs to confirm the ban.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error banning the user. Please try again.', ephemeral: true });
        }
    },
};
