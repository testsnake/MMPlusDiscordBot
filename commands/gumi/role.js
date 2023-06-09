const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Gives you a role')
        .setDescriptionLocalizations({
            de: 'Gibt Ihnen eine Rolle',
            'en-GB': 'Gives you a role',
            'en-US': 'Gives you a role',
            'es-ES': 'Te da un rol',
            fr: 'Vous donne un rôle',
            nl: 'Geeft je een rol',
            'pt-BR': 'Dá-lhe um papel',
            'zh-CN': '给你一个角色',
            ja: '役割を与えます',
            'zh-TW': '給你一個角色',
            ko: '역할을 부여합니다',
        })
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The role you want to give yourself')
                .setDescriptionLocalizations({
                    de: 'Die Rolle, die Sie sich selbst geben möchten',
                    'en-GB': 'The role you want to give yourself',
                    'en-US': 'The role you want to give yourself',
                    'es-ES': 'El rol que quieres darte a ti mismo',
                    fr: 'Le rôle que vous voulez vous donner',
                    nl: 'De rol die je jezelf wilt geven',
                    'pt-BR': 'O papel que você quer dar a si mesmo',
                    'zh-CN': '你想赋予自己的角色',
                    ja: '自分に与えたい役割',
                    'zh-TW': '你想給自己的角色',
                    ko: '자신에게 부여하려는 역할',
                })
                .setRequired(true)
                .addChoices(
                    { name: 'Event Ping', value: '1102399054656315523' },
                    { name: 'Modder', value: "1102667046854078525"},
                    { name: 'Charter', value: "1102667128336822392"},
                    { name: 'Modeler', value: "1102667173022937159"},
                    { name: 'Programmer', value: "1102667447611424778"},
                    { name: 'VC Ping', value: "1112491477566771282"},
                    { name: 'Live in VC Ping', value: "1112491540577796166"},
                    { name: 'Gartic Phone', value: "1118329199229407292"},
                    { name: 'Game Night', value: "1118329956368392222"},
                    { name: 'Duels (10☆)', value: "1118331060946731130"},
                    { name: 'Duels (8-9☆)', value: "1118331176038436965"},
                    { name: 'Duels (5-7☆)', value: "1118331343949025350"},
                    { name: 'Duels (Any)', value: "1118331457828569118"},
                    { name: 'Mario Kart 8 DX', value: "1118332990645346325"},
                    { name: 'Mario Kart Wii', value: "1118333092034269226"},
                    { name: "Mega Mix+ Updates", value: "1121513926404886638"},
                    { name: "Diva Weeklies", value: "1123020093207617647"}


                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const role = interaction.options.getString('role');
            const newRole = await interaction.guild.roles.cache.get(role);

            if (interaction.member.roles.cache.has(role)) {
                await interaction.member.roles.remove(newRole);
                await interaction.reply({
                    content: `Removed ${newRole.name} `,
                    allowedMentions: {repliedUser: false},
                    ephemeral: true
                });
            } else {
                await interaction.member.roles.add(newRole);
                await interaction.reply({
                    content: `Added ${newRole.name} `,
                    allowedMentions: {repliedUser: false},
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command! Please message testsnake with the following error: ' + error,
                ephemeral: true
            });
        }


    }


}
