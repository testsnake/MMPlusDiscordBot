const { SlashCommandBuilder, Discord, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user.')
        .setDescriptionLocalizations({
            de: 'Verwarnt einen Benutzer.',
            'en-GB': 'Warns a user.',
            'en-US': 'Warns a user.',
            'es-ES': 'Advierte a un usuario.',
            fr: 'Avertit un utilisateur.',
            nl: 'Waarschuwt een gebruiker.',
            'pt-BR': 'Avisa um usuário.',
            'zh-CN': '警告一个用户。',
            ja: 'ユーザーに警告します。',
            'zh-TW': '警告一個用戶。',
            ko: '사용자를 경고합니다.',
        })
        .addUserOption(option => option.setName('user').setDescription('The user you want to warn.').setDescriptionLocalizations({
            de: 'Der Benutzer, den du verwarnen möchtest.',
            'en-GB': 'The user you want to warn.',
            'en-US': 'The user you want to warn.',
            'es-ES': 'El usuario al que quieres advertir.',
            fr: 'L\'utilisateur que vous souhaitez avertir.',
            nl: 'De gebruiker die je wilt waarschuwen.',
            'pt-BR': 'O usuário que você quer avisar.',
            'zh-CN': '您想警告的用户。',
            ja: '警告したいユーザー。',
            'zh-TW': '您想要警告的用戶。',
            ko: '경고하려는 사용자.',
        }).setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning.').setDescriptionLocalizations({
            de: 'Der Grund für die Verwarnung.',
            'en-GB': 'The reason for the warning.',
            'en-US': 'The reason for the warning.',
            'es-ES': 'La razón de la advertencia.',
            fr: 'La raison de l\'avertissement.',
            nl: 'De reden voor de waarschuwing.',
            'pt-BR': 'O motivo do aviso.',
            'zh-CN': '警告的原因。',
            ja: '警告の理由。',
            'zh-TW': '警告的原因。',
            ko: '경고 사유.',
        }).setRequired(true)),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const member = await interaction.guild.members.fetch(user);
            const timeoutDuration = [30 * 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000];
            const warningRoles = [
                '1092918336309968976', // Level 1
                '1092919144283914301', // Level 2
                '1092919174881353868', // Level 3
            ];
            const autoModChannel = '1092866838918086666'
            const channel = interaction.guild.channels.cache.get(autoModChannel);

            let currentWarningLevel = -1;
            for (let i = 0; i < warningRoles.length; i++) {
                if (member.roles.cache.has(warningRoles[i])) {
                    currentWarningLevel = i;
                    break;
                }
            }

            if (currentWarningLevel === -1) {
                // Give level 1 warning role
                await member.roles.add(warningRoles[0]);
                await member.timeout(timeoutDuration[0], reason);
                await user.send(`You have been warned in ${interaction.guild.name} for the following reason: ${reason}`);
                await interaction.reply(`${user} has been warned. This is warning number 1`);
                await channel.send(`${member.toString()} has been warned by ${interaction.user.tag} for **${reason}**`)
            } else if (currentWarningLevel < 2) {
                // Remove current role and give next level warning role
                await member.roles.remove(warningRoles[currentWarningLevel]);
                await member.roles.add(warningRoles[currentWarningLevel + 1]);
                await member.timeout(timeoutDuration[currentWarningLevel + 1], reason);
                await user.send(`You have been warned in ${interaction.guild.name} for the following reason: ${reason}`);
                await interaction.reply(`${user} has been warned. This is warning number ${currentWarningLevel + 2}.`);
                await channel.send(`${member.toString()} has been warned by ${interaction.user.tag} for **${reason}**\nUser is at ${currentWarningLevel + 2} warning(s)`);
            } else {
                // User already has level 3, call reqban function
                //await member.roles.remove(warningRoles[currentWarningLevel]);

                const warningEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: 'User has been warned for the 3rd time',
                        iconURL: member.avatarURL({dynamic: true})
                    })
                    .setDescription(`${member.toString()} has been warned 3 times.`)
                    .addFields(
                        {name: `Joined`, value: `${member.joinedAt.toDateString()}`, inline: true},
                        {name: `Warned by`, value: `${interaction.user.toString()}`, inline: true},
                        {name: "Reason", value: `${reason}`, inline: true},
                        {name: "Roles", value: `${member.roles.cache.map(role => role.name).join(', ')}`, inline: true}
                    )
                    .setColor(0xeb4034)

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`Miku Bot#7587_kick_confirm_${member.id}`)
                            .setLabel('Kick')
                            .setStyle('Secondary'),
                        new ButtonBuilder()
                            .setCustomId(`Miku Bot#7587_ban_confirm_${member.id}`)
                            .setLabel('Ban')
                            .setStyle('Danger')
                    );


                await member.timeout(timeoutDuration[3], reason);
                await user.send(`You have been warned in ${interaction.guild.name} for the following reason: ${reason}`);
                await interaction.reply(`${user} has reached maximum warning level, requesting ban in <#1092866838918086666>.`);
                await channel.send({embeds: [warningEmbed],  components: [row] });
            }
        } catch (err) {
            console.error(err);
        }
    },
};
