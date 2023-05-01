const { SlashCommandBuilder } = require('discord.js');

async function grabSpecialRole(member, lowerBoundId, upperBoundId) {
    const lowerBoundRole = await member.guild.roles.cache.get(lowerBoundId);
    const upperBoundRole = await member.guild.roles.cache.get(upperBoundId);

    if (!lowerBoundRole || !upperBoundRole) return null;

    const eligibleRoles = await member.roles.cache.filter(role => {
        const lowerComparison = role.comparePositionTo(lowerBoundRole);
        const upperComparison = role.comparePositionTo(upperBoundRole);
        return lowerComparison > 0 && upperComparison < 0;
    });

    if (eligibleRoles.size > 0) {
        // Find the role with the highest position
        return eligibleRoles.reduce((highestRole, currentRole) => {
            return currentRole.comparePositionTo(highestRole) > 0 ? currentRole : highestRole;
        });
    } else {
        return null;
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('booster')
        .setNameLocalizations({
            de: 'booster',
            'en-GB': 'booster',
            'en-US': 'booster',
            'es-ES': 'impluso',
            it: 'potenziamento',
            fr: 'booster',
            nl: 'booster',
            'pt-BR': 'impulsionador',
            'zh-CN': '助推器',
            ja: 'ブースター',
            'zh-TW': '助推器',
            ko: '부스터',

        })
        .setDescription('Manages your booster role.')
        .setDescriptionLocalizations({
            de: 'Verwalte deine Booster-Rolle.',
            'en-GB': 'Manages your booster role.',
            'en-US': 'Manages your booster role.',
            'es-ES': 'Administra tu rol de potenciador.',
            fr: 'Gère ton rôle de booster.',
            nl: 'Beheert je booster-rol.',
            'pt-BR': 'Gerencia sua função de impulsionador.',
            'zh-CN': '管理您的助推器角色。',
            ja: 'ブースターロールを管理します。',
            'zh-TW': '管理您的助推器角色。',
            ko: '부스터 역할 관리.',
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolorhex')
                .setDescription('Changes the color of your booster role with hex')
                .setDescriptionLocalizations({
                    de: 'Ändert die Farbe deiner Booster-Rolle mit Hex.',
                    'en-GB': 'Changes the color of your booster role with hex.',
                    'en-US': 'Changes the color of your booster role with hex.',
                    'es-ES': 'Cambia el color de tu rol de potenciador con hex.',
                    fr: 'Change la couleur de votre rôle de booster avec hex.',
                    nl: 'Verandert de kleur van je booster-rol met hex.',
                    'pt-BR': 'Altera a cor do seu papel de impulsionador com hex.',
                    'zh-CN': '使用十六进制更改助推器角色的颜色。',
                    ja: 'ブースターロールの色を16進数で変更します。',
                    'zh-TW': '使用十六進制更改助推器角色的顏色。',
                    ko: '부스터 역할 색상 변경 (16진수).',
                })
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color to change to. Format #RRGGBB.')
                        .setDescriptionLocalizations({
                            de: 'Die Farbe, zu der gewechselt werden soll. Format #RRGGBB.',
                            'en-GB': 'The color to change to. Format #RRGGBB.',
                            'en-US': 'The color to change to. Format #RRGGBB.',
                            'es-ES': 'El color al que cambiar. Formato #RRGGBB.',
                            fr: 'La couleur à changer. Format #RRGGBB.',
                            nl: 'De kleur om naar te veranderen. Formaat #RRGGBB.',
                            'pt-BR': 'A cor para mudar. Formato #RRGGBB.',
                            'zh-CN': '要更改的颜色。格式 #RRGGBB。',
                            ja: '変更する色。形式 #RRGGBB。',
                            'zh-TW': '要更改的顏色。格式 #RRGGBB。',
                            ko: '변경할 색상. 형식 #RRGGBB.',
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolor')
                .setDescription('Changes the color of your booster role.')
                    .setDescriptionLocalizations({
                        de: 'Ändert die Farbe deiner Booster-Rolle.',
                        'en-GB': 'Changes the color of your booster role.',
                        'en-US': 'Changes the color of your booster role.',
                        'es-ES': 'Cambia el color de tu rol de potenciador.',
                        fr: 'Change la couleur de votre rôle de booster.',
                        nl: 'Verandert de kleur van je booster-rol.',
                        'pt-BR': 'Altera a cor do seu papel de impulsionador.',
                        'zh-CN': '更改助推器角色的颜色。',
                        ja: 'ブースターロールの色を変更します。',
                        'zh-TW': '更改助推器角色的顏色。',
                        ko: '부스터 역할 색상 변경.',
                    })
                    .addStringOption(option =>
                        option.setName('color')
                            .setDescription('The color to change to.')
                            .setDescriptionLocalizations({
                                de: 'Die Farbe, zu der gewechselt werden soll.',
                                'en-GB': 'The color to change to.',
                                'en-US': 'The color to change to.',
                                'es-ES': 'El color al que cambiar.',
                                fr: 'La couleur à changer.',
                                nl: 'De kleur om naar te veranderen.',
                                'pt-BR': 'A cor para mudar.',
                                'zh-CN': '要更改的颜色。',
                                ja: '変更する色。',
                                'zh-TW': '要更改的顏色。',
                                ko: '변경할 색상.',
                            })
                            .setRequired(true)
                            .addChoices(
                                {name: 'Red', value: 'red'},
                                {name: 'Orange', value: 'orange'},
                                {name: 'Yellow', value: 'yellow'},
                                {name: 'Green', value: 'green'},
                                {name: 'Blue', value: 'blue'},
                                {name: 'Purple', value: 'purple'},
                                {name: 'Pink', value: 'pink'},
                                {name: 'Black', value: 'black'},
                                {name: 'White', value: 'white'},
                                {name: 'Grey', value: 'grey'},
                                {name: 'Brown', value: 'brown'},
                                {name: 'Cyan', value: 'cyan'},
                                {name: 'Lime', value: 'lime'},
                                {name: 'Magenta', value: 'magenta'},
                                {name: 'Teal', value: 'teal'},
                                {name: 'Miku Blue', value: 'mikublue'},
                                {name: 'Rin Orange', value: 'rinyellow'},
                                {name: 'Len Yellow', value: 'lenorange'},
                                {name: 'Luka Pink', value: 'lukapink'},
                                {name: 'Kaito Blue', value: 'Kaito Blue'},
                                {name: 'Meiko Red', value: 'meikored'},
                                {name: 'Neru Yellow', value: 'neruyellow'},
                                {name: 'Haku Grey', value: 'hakugrey'},
                                {name: 'Teto Red', value: 'tetored'},
                                {name: 'Gumi Green', value: 'gumigreen'}
                            )

                    )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set name')
                .setNameLocalizations({
                    de: 'setze-name',
                    'en-GB': 'setname',
                    'en-US': 'setname',
                    'es-ES': 'establecer-nombre',
                    fr: 'nom-ensemble',
                    nl: 'setname',
                    'pt-BR': 'definir-nome',
                    'zh-CN': 'setname',
                    ja: 'setname',
                    'zh-TW': 'setname',
                    ko: 'setname',
                })
                .setDescription('Changes the name of your booster role.')
                .setDescriptionLocalizations({
                    de: 'Ändert den Namen deiner Booster-Rolle.',
                    'en-GB': 'Changes the name of your booster role.',
                    'en-US': 'Changes the name of your booster role.',
                    'es-ES': 'Cambia el nombre de tu rol de potenciador.',
                    fr: 'Change le nom de votre rôle de booster.',
                    nl: 'Verandert de naam van je booster-rol.',
                    'pt-BR': 'Altera o nome do seu papel de impulsionador.',
                    'zh-CN': '更改助推器角色的名字。',
                    ja: 'ブースターロールの名前を変更します。',
                    'zh-TW': '更改助推器角色的名稱。',
                    ko: '부스터 역할 이름 변경.',
                })
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name to change to.')
                        .setDescriptionLocalizations({
                            de: 'Der Name, zu dem gewechselt werden soll.',
                            'en-GB': 'The name to change to.',
                            'en-US': 'The name to change to.',
                            'es-ES': 'El nombre al que cambiar.',
                            fr: 'Le nom à changer.',
                            nl: 'De naam om naar te veranderen.',
                            'pt-BR': 'O nome para mudar.',
                            'zh-CN': '要更改的名字。',
                            ja: '変更する名前。',
                            'zh-TW': '要更改的名稱。',
                            ko: '변경할 이름.',
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set_icon')
                .setNameLocalizations({
                    'zh-CN': '设置图标',
                    ja: 'アイコンを設定',
                    'zh-TW': '設置圖示',
                    ko: '아이콘설정',
                })
                .setDescription('Changes the icon of your booster role.')
                .setDescriptionLocalizations({
                    de: 'Ändert das Symbol Ihrer Booster-Rolle.',
                    'en-GB': 'Changes the icon of your booster role.',
                    'en-US': 'Changes the icon of your booster role.',
                    'es-ES': 'Cambia el ícono de tu rol de potenciador.',
                    fr: 'Change l\'icône de votre rôle de booster.',
                    nl: 'Verandert het pictogram van uw booster-rol.',
                    'pt-BR': 'Altera o ícone do seu papel de impulsionador.',
                    'zh-CN': '更改助推器角色的图标。',
                    ja: 'ブースターロールのアイコンを変更します。',
                    'zh-TW': '更改您的助推器角色的圖示。',
                    ko: '부스터 역할의 아이콘 변경.',
                })
                .addStringOption(option =>
                    option.setName('icon')
                        .setDescription('Icon URL')
                        .setDescriptionLocalizations({
                            de: 'Symbol-URL',
                            'en-GB': 'Icon URL',
                            'en-US': 'Icon URL',
                            'es-ES': 'URL del ícono',
                            fr: 'URL de l\'icône',
                            nl: 'Icoon URL',
                            'pt-BR': 'URL do ícone',
                            'zh-CN': '图标的URL',
                            ja: 'アイコンのURL',
                            'zh-TW': '圖示網址',
                            ko: '아이콘 URL',
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setNameLocalizations({
                    de: 'hilfe',
                    'en-GB': 'help',
                    'en-US': 'help',
                    'es-ES': 'ayuda',
                    fr: 'aide',
                    nl: 'help',
                    'pt-BR': 'ajuda',
                    'zh-CN': '帮助',
                    ja: 'ヘルプ',
                    'zh-TW': '説明',
                    ko: '도움말',
                })
                .setDescription('Shows help message.')
                .setDescriptionLocalizations({
                    de: 'Zeigt die Hilfenachricht an.',
                    'en-GB': 'Shows help message.',
                    'en-US': 'Shows help message.',
                    'es-ES': 'Muestra mensaje de ayuda.',
                    fr: 'Affiche le message d\'aide.',
                    nl: 'Toont helpbericht.',
                    'pt-BR': 'Exibe mensagem de ajuda.',
                    'zh-CN': '显示帮助信息。',
                    ja: 'ヘルプメッセージを表示します。',
                    'zh-TW': '顯示説明訊息。',
                    ko: '도움말 메시지 표시.',
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setNameLocalizations({
                    de: 'erstellen',
                    'en-GB': 'create',
                    'en-US': 'create',
                    'es-ES': 'crear',
                    fr: 'créer',
                    nl: 'creëren',
                    'pt-BR': 'criar',
                    'zh-CN': '创建',
                    ja: '作成',
                    'zh-TW': '創建',
                    ko: '만들기',
                })
                .setDescription('Creates a custom booster role.')
                .setDescriptionLocalizations({
                    de: 'Erstellt eine benutzerdefinierte Booster-Rolle.',
                    'en-GB': 'Creates a custom booster role.',
                    'en-US': 'Creates a custom booster role.',
                    'es-ES': 'Crea un rol de potenciador personalizado.',
                    fr: 'Crée un rôle de booster personnalisé.',
                    nl: 'Maakt een aangepaste booster-rol.',
                    'pt-BR': 'Cria um papel de impulsionador personalizado.',
                    'zh-CN': '创建自定义助推器角色。',
                    ja: 'カスタムブースターロールを作成します。',
                    'zh-TW': '建立自訂助推器角色。',
                    ko: '맞춤 부스터 역할 생성.',
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deletes your booster role.')
                .setDescriptionLocalizations({
                    de: 'Löscht deine Booster-Rolle.',
                    'en-GB': 'Deletes your booster role.',
                    'en-US': 'Deletes your booster role.',
                    'es-ES': 'Elimina tu rol de potenciador.',
                    fr: 'Supprime votre rôle de booster.',
                    nl: 'Verwijdert je booster-rol.',
                    'pt-BR': 'Exclui seu papel de impulsionador.',
                    'zh-CN': '删除您的助推器角色。',
                    ja: 'ブースターロールを削除します。',
                    'zh-TW': '刪除您的助推器角色。',
                    ko: '부스터 역할 삭제.',
                })
        ),

    async execute(interaction) {
        try {
            if (!interaction.member.roles.cache.has('1092636310142980127') && !interaction.member.roles.cache.has('1093385832540405770')) {
                return await interaction.reply({content: 'You do not have a booster role.', ephemeral: true});
            } else {
                const subcommand = interaction.options.getSubcommand();
                const specialRole = await grabSpecialRole(interaction.member, '1093246448566550579', '1093246368077840424');
                if (!specialRole) {
                    if (subcommand === 'help') {
                        return await interaction.reply({
                            content: 'This feature is still in its early stages. Message testsnake if you have any issues',
                            ephemeral: true
                        });
                    } else if (subcommand === 'create') {
                        const boosterRolePosition = await interaction.guild.roles.cache.get('1093246448566550579').position;
                        const boosterRolePos = boosterRolePosition + 1;
                        const boosterRole = await interaction.guild.roles.create({

                                name: "Unnamed Role",
                                hoist: false,
                                mentionable: false,
                                position: boosterRolePos,
                                reason: 'Booster role creation'

                        });


                        await interaction.member.roles.add(boosterRole);

                        return await interaction.reply({content: 'Created a booster role.', ephemeral: true});
                    }

                    return await interaction.reply({
                        content: 'You do not have a booster role. You can use /booster create to create a booster role.\nContact <@201460040564080651> for more information.',
                        ephemeral: true
                    });
                } else {
                    if (subcommand === 'setcolorhex') {
                        const color = interaction.options.getString('color');
                        if (color.startsWith('#')) {
                            await specialRole.setColor(color);
                            return await interaction.reply({content: 'Changed color to ' + color, ephemeral: true});
                        } else {
                            return await interaction.reply({
                                content: 'Invalid color. Please use the format #RRGGBB.',
                                ephemeral: true
                            });
                        }
                    } else if (subcommand === 'setcolor') {
                        const colorMap = {
                            red: '#FF0000',
                            orange: '#FFA500',
                            yellow: '#FFFF00',
                            green: '#008000',
                            blue: '#0000FF',
                            purple: '#800080',
                            pink: '#FFC0CB',
                            black: '#000000',
                            white: '#FFFFFF',
                            grey: '#808080',
                            brown: '#A52A2A',
                            cyan: '#00FFFF',
                            lime: '#00FF00',
                            magenta: '#FF00FF',
                            teal: '#008080',
                            mikublue: '#33ccba',
                            kagamineorange: '#ffcc11',
                            kagamineyellow: '#ffee12',
                            lukapink: '#ffbacc',
                            kaitoblue: '#3367cd',
                            meikored: '#de4444',
                            neruyellow: '#face1e',
                            hakugrey: '#a3a3a3',
                            tetored: '#d54458',
                            gumigreen: '#9fe390'
                        };
                        const color = interaction.options.getString('color');
                        const hexColor = colorMap[color];

                        if (!hexColor) {
                            return await interaction.reply({content: 'Invalid color.', ephemeral: true});
                        }

                        await specialRole.setColor(hexColor);
                        return await interaction.reply({content: `Changed color to ${color} (${hexColor})`, ephemeral: true});
                    } else if (subcommand === 'setname') {
                        const name = interaction.options.getString('name');
                        await specialRole.setName(name);
                        return await interaction.reply({content: 'Changed name to ' + name, ephemeral: true});
                    } else if (subcommand === 'seticon') {
                        try {
                            const icon = interaction.options.getString('icon');
                            await specialRole.setIcon(icon);
                            return await interaction.reply({content: 'Changed icon to ' + icon, ephemeral: true});
                        } catch (error) {
                            return await interaction.reply({
                                content: 'Invalid icon. Make sure it is a valid URL.',
                                ephemeral: true
                            });
                        }
                    } else if (subcommand === 'help') {
                        return await interaction.reply({
                            content: 'This feature is still in its early stages. Message testsnake if you have any issues',
                            ephemeral: true
                        });
                    } else if (subcommand === 'create') {
                        await interaction.reply({content: 'You already have a custom booster role', ephemeral: true});
                    } else if (subcommand === 'delete') {
                        await specialRole.delete();
                        return await interaction.reply({content: 'Deleted your custom booster role', ephemeral: true});
                    }
                }
            }

        } catch (error) {
            console.log(error);
            return await interaction.reply({content: 'An error occurred. Please try again later.', ephemeral: true});
        }
    }
}