const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, ActivityType, PermissionFlagsBits} = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const botAvatarURL = fs.readFileSync('./botAvatar.txt', 'utf8');
const loggingChannel = '1087810388936114316';

function parseDuration(durationStr) {
    const units = {
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000
    };

    const regex = /^(\d+)([smhd])$/;
    const match = durationStr.match(regex);

    if (!match) {
        return null;
    }

    return parseInt(match[1], 10) * units[match[2]];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setNameLocalizations({
            ja: 'タイムアウト',
            'zh-TW': '超時',
            ko: '타임아웃',
            "zh-CN": "超时",
            'pt-BR': 'tempolimite',
            nl: 'time-out',
            fr: 'tempsmort',
            "es-ES": 'tiempofuera',
            'en-US': 'timeout',
            'en-GB': 'mute',
            de: 'timeout'
        })
        .setDescription('Gibt einem Benutzer eine Auszeit für eine angegebene Dauer.')
        .setDescriptionLocalizations({
            de: 'Gibt einem Benutzer eine Auszeit für eine angegebene Dauer.',
            'en-GB': 'Gives a user a timeout for a specified duration.',
            'en-US': 'Gives a user a timeout for a specified duration.',
            'es-ES': 'Da a un usuario un tiempo de espera por una duración especificada.',
            fr: 'Donne à un utilisateur une période d\'attente pour une durée spécifiée.',
            nl: 'Geeft een gebruiker een time-out voor een opgegeven tijdsduur.',
            'pt-BR': 'Dá a um usuário uma pausa por um período de tempo especificado.',
            'zh-CN': '为用户指定的持续时间给予超时。',
            ja: '指定された期間のユーザーのタイムアウトを与えます。',
            'zh-TW': '為用戶指定的持續時間給予超時。',
            ko: '지정된 기간 동안 사용자에게 타임아웃을 부여합니다.',
        })
        .addUserOption(option => option.setName('user').setDescription('Den Benutzer geben, der eine Auszeit erhält.').setDescriptionLocalizations({
            de: 'Den Benutzer geben, der eine Auszeit erhält.',
            'en-GB': 'The user to give a timeout.',
            'en-US': 'The user to give a timeout.',
            'es-ES': 'El usuario al que dar un tiempo de espera.',
            fr: 'L\'utilisateur à mettre en attente.',
            nl: 'De gebruiker aan wie een time-out moet worden gegeven.',
            'pt-BR': 'O usuário que receberá uma pausa.',
            'zh-CN': '给予超时的用户。',
            ja: 'タイムアウトを与えるユーザー。',
            'zh-TW': '給予超時的用戶。',
            ko: '타임아웃을 부여할 사용자입니다.',
        }).setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Die Dauer des Timeouts. (z.B. 10m, 1h)').setRequired(true).setDescriptionLocalizations({
            de: 'Die Dauer des Timeouts. (z.B. 10m, 1h)',
            'en-GB': 'The duration of the timeout. (e.g., 10m, 1h)',
            'en-US': 'The duration of the timeout. (e.g., 10m, 1h)',
            'es-ES': 'La duración del tiempo de espera. (por ejemplo, 10m, 1h)',
            fr: 'La durée du temps d\'attente. (par exemple, 10m, 1h)',
            nl: 'De duur van de time-out. (bijv. 10m, 1u)',
            'pt-BR': 'A duração do timeout. (ex.: 10m, 1h)',
            'zh-CN': '超时的持续时间。 (例如，10m，1h)',
            ja: 'タイムアウトの期間（例：10m、1h）',
            'zh-TW': '超時的持續時間。 (例如，10m，1h)',
            ko: '타임아웃 지속 시간. (예 : 10m, 1h)',
        }))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the timeout.').setRequired(false).setDescriptionLocalizations({
            de: 'Der Grund für den Timeout.',
            'en-GB': 'The reason for the timeout.',
            'en-US': 'The reason for the timeout.',
            'es-ES': 'La razón del tiempo de espera.',
            fr: 'La raison du temps d\'attente.',
            nl: 'De reden voor de time-out.',
            'pt-BR': 'A razão para o timeout.',
            'zh-CN': '超时的原因。',
            ja: 'タイムアウトの理由。',
            'zh-TW': '超時的原因。',
            ko: '타임아웃의 이유.',
        }))
        .setDefaultMemberPermissions(PermissionFlagsBits.MODERATE_MEMBERS)
        .setDMPermission(false),
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

        const durationMs = parseDuration(duration);
        if (!durationMs) {
            return await interaction.reply({ content: 'Invalid duration format. Please use the format: 10m, 1h, etc.', ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user);

            const hasRestrictedRole = restrictedRoles.some(role => member.roles.cache.has(role));

            if (hasRestrictedRole) {
                return await interaction.reply({ content: 'You cannot give a timeout to a user with a protected role.', ephemeral: true });
            }

            await member.timeout(durationMs, reason);
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
