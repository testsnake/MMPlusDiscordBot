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
        .addSubcommandGroup(group =>
            group.setName('setroleicon')
                .setNameLocalizations({
                    de: 'setroleicon',
                    'en-GB': 'setroleicon',
                    'en-US': 'setroleicon',
                    'es-ES': 'establecericonoderol',
                    fr: 'seticonepave',
                    nl: 'setrolepictogram',
                    'pt-BR': 'definiriconedepapel',
                    'zh-CN': '设置角色图标',
                    ja: '役割アイコンを設定',
                    'zh-TW': '設置角色圖標',
                    ko: '역할아이콘설정',
                })
                .setDescription('Changes the icon of your booster role.')
                .setDescriptionLocalizations({
                    de: 'Ändert das Symbol Ihrer Booster-Rolle.',
                    'en-GB': 'Changes the icon of your booster role.',
                    'en-US': 'Changes the icon of your booster role.',
                    'es-ES': 'Cambia el ícono de tu rol de potenciador.',
                    fr: 'Change l\'icône de votre rôle de booster.',
                    nl: 'Verandert het pictogram van je booster-rol.',
                    'pt-BR': 'Altera o ícone do seu papel de impulsionador.',
                    'zh-CN': '更改助推器角色的图标。',
                    ja: 'ブースターロールのアイコンを変更します。',
                    'zh-TW': '更改助推器角色的圖標。',
                    ko: '부스터 역할 아이콘 변경.',
                })
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('link')
                        .setNameLocalizations({
                            de: 'link',
                            'en-GB': 'link',
                            'en-US': 'link',
                            'es-ES': 'enlace',
                            fr: 'lien',
                            nl: 'link',
                            'pt-BR': 'link',
                            'zh-CN': '链接',
                            ja: 'リンク',
                            'zh-TW': '連結',
                            ko: '링크',
                        })
                        .setDescription('Set icon using a link.')
                        .setDescriptionLocalizations({
                            de: 'Symbol mit einem Link setzen.',
                            'en-GB': 'Set icon using a link.',
                            'en-US': 'Set icon using a link.',
                            'es-ES': 'Establecer icono utilizando un enlace.',
                            fr: 'Définir l\'icône en utilisant un lien.',
                            nl: 'Pictogram instellen met behulp van een link.',
                            'pt-BR': 'Definir ícone usando um link.',
                            'zh-CN': '使用链接设置图标。',
                            ja: 'リンクを使用してアイコンを設定します。',
                            'zh-TW': '使用連結設置圖標。',
                            ko: '링크를 사용하여 아이콘 설정.',
                        })
                        .addStringOption(option =>
                            option.setName('icon')
                                .setDescription('Icon URL')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('attachment')
                        .setNameLocalizations({
                            de: 'anhang',
                            'en-GB': 'attachment',
                            'en-US': 'attachment',
                            'es-ES': 'adjunto',
                            fr: 'attachement',
                            nl: 'bijlage',
                            'pt-BR': 'anexo',
                            'zh-CN': '附件',
                            ja: '添付',
                            'zh-TW': '附件',
                            ko: '첨부',
                        })
                        .setDescription('Set icon using an attachment.')
                        .setDescriptionLocalizations({
                            de: 'Symbol mit einem Anhang setzen.',
                            'en-GB': 'Set icon using an attachment.',
                            'en-US': 'Set icon using an attachment.',
                            'es-ES': 'Establecer icono utilizando un adjunto.',
                            fr: 'Définir l\'icône en utilisant une pièce jointe.',
                            nl: 'Pictogram instellen met behulp van een bijlage.',
                            'pt-BR': 'Definir ícone usando um anexo.',
                            'zh-CN': '使用附件设置图标。',
                            ja: '添付ファイルを使用してアイコンを設定します。',
                            'zh-TW': '使用附件設置圖標。',
                            ko: '첨부 파일을 사용하여 아이콘 설정.',
                        })
                        .addAttachmentOption(option =>
                            option.setName('icon')
                                .setDescription('Icon')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                        subcommand
                            .setName('emoji')
                            .setNameLocalizations({
                                de: 'emoji',
                                'en-GB': 'emoji',
                                'en-US': 'emoji',
                                'es-ES': 'emoji',
                                fr: 'emoji',
                                nl: 'emoji',
                                'pt-BR': 'emoji',
                                'zh-CN': '表情',
                                ja: '絵文字',
                                'zh-TW': '表情',
                                ko: '이모티콘',
                            })
                            .setDescription('Set icon using an emoji.')
                            .setDescriptionLocalizations({
                                de: 'Symbol mit einem Emoji setzen.',
                                'en-GB': 'Set icon using an emoji.',
                                'en-US': 'Set icon using an emoji.',
                                'es-ES': 'Establecer icono utilizando un emoji.',
                                fr: 'Définir l\'icône en utilisant un emoji.',
                                nl: 'Pictogram instellen met behulp van een emoji.',
                                'pt-BR': 'Definir ícone usando um emoji.',
                                'zh-CN': '使用表情设置图标。',
                                ja: '絵文字を使用してアイコンを設定します。',
                                'zh-TW': '使用表情設置圖標。',
                                ko: '이모티콘을 사용하여 아이콘 설정.',
                            })
                            .addStringOption(option =>
                                option.setName('emoji')
                                    .setDescription('Emoji')
                                    .setRequired(true)
                            )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('avatar')
                        .setNameLocalizations({
                            de: 'avatar',
                            'en-GB': 'avatar',
                            'en-US': 'avatar',
                            'es-ES': 'avatar',
                            fr: 'avatar',
                            nl: 'avatar',
                            'pt-BR': 'avatar',
                            'zh-CN': '头像',
                            ja: 'アバター',
                            'zh-TW': '頭像',
                            ko: '아바타',
                        })
                        .setDescription('Set icon using an avatar.')
                        .setDescriptionLocalizations({
                            de: 'Symbol mit einem Avatar setzen.',
                            'en-GB': 'Set icon using an avatar.',
                            'en-US': 'Set icon using an avatar.',
                            'es-ES': 'Establecer icono utilizando un avatar.',
                            fr: 'Définir l\'icône en utilisant un avatar.',
                            nl: 'Pictogram instellen met behulp van een avatar.',
                            'pt-BR': 'Definir ícone usando um avatar.',
                            'zh-CN': '使用头像设置图标。',
                            ja: 'アバターを使用してアイコンを設定します。',
                            'zh-TW': '使用頭像設置圖標。',
                            ko: '아바타를 사용하여 아이콘 설정.',
                        })
                        .addUserOption(option =>
                            option.setName('user')
                                .setDescription('User')
                                .setRequired(true)
                        )
                )

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolor')
                .setNameLocalizations({
                    de: 'setcolor',
                    'en-GB': 'setcolour',
                    'en-US': 'setcolor',
                    'es-ES': 'establecercolor',
                    fr: 'setcouleur',
                    nl: 'setkleur',
                    'pt-BR': 'definircor',
                    'zh-CN': '设置颜色',
                    ja: '色を設定する',
                    'zh-TW': '設置顏色',
                    ko: '색상설정',
                })
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
                .setName('setcolorhex')
                .setNameLocalizations({
                    de: 'setcolorhex',
                    'en-GB': 'setcolourhex',
                    'en-US': 'setcolorhex',
                    'es-ES': 'establecercolorhex',
                    fr: 'setcouleurhex',
                    nl: 'setkleurhex',
                    'pt-BR': 'definircorhex',
                    'zh-CN': '设置颜色十六进制值',
                    ja: '色の16進数値を設定する',
                    'zh-TW': '設置顏色十六進制值',
                    ko: '색상16진수값설정',

                })
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
                        .setNameLocalizations({
                            de: 'farbe',
                            'en-GB': 'colour',
                            'en-US': 'color',
                            'es-ES': 'color',
                            fr: 'couleur',
                            nl: 'kleur',
                            'pt-BR': 'cor',
                            'zh-CN': '颜色',
                            ja: '色',
                            'zh-TW': '顏色',
                            ko: '색깔',
                        })
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
                .setName('setname')
                .setNameLocalizations({
                    de: 'setze-name',
                    'en-GB': 'setname',
                    'en-US': 'setname',
                    'es-ES': 'establecer-nombre',
                    fr: 'nom-ensemble',
                    nl: 'setname',
                    'pt-BR': 'definir-nome',
                    'zh-CN': '设置名称',
                    ja: '名前を設定する',
                    'zh-TW': '設置名稱',
                    ko: '이름설정',
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
                .setNameLocalizations({
                    de: 'löschen',
                    'en-GB': 'delete',
                    'en-US': 'delete',
                    'es-ES': 'eliminar',
                    fr: 'supprimer',
                    nl: 'verwijderen',
                    'pt-BR': 'excluir',
                    'zh-CN': '删除',
                    ja: '削除',
                    'zh-TW': '刪除',
                    ko: '삭제',

                })
        ),

    async execute(interaction) {
        try {
            if (!interaction.member.roles.cache.has('1092636310142980127') && !interaction.member.roles.cache.has('1093385832540405770')) {
                return await interaction.reply({content: 'You do not have a booster role.', ephemeral: true});
            } else {
                const subcommand = interaction.options.getSubcommand();
                const subcommandGroup = interaction.options.getSubcommandGroup();
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
                    } else if (subcommandGroup === 'setroleicon') {
                        let newIconURL;

                        switch (subcommand) {
                            case 'link':
                                newIconURL = interaction.options.getString('icon');
                                break;
                            case 'attachment':
                                const attachment = interaction.options.getAttachment('icon');
                                const attachmentURL = attachment.url;

                                // Check if the URL ends with .gif, .png, or .jpg
                                if (!/\.(gif|png|jpg)$/i.test(attachmentURL)) {
                                    return await interaction.reply({content: 'Invalid image format. Please use a .gif, .png, or .jpg image.', ephemeral: true});
                                }

                                newIconURL = attachmentURL;
                                break;
                            case 'avatar':
                                const user = interaction.options.getUser('user');
                                newIconURL = user.displayAvatarURL();
                                break;
                            case 'emoji':
                                const emojiInput = interaction.options.getString('emoji');
                                const emojiId = emojiInput.match(/(?<=:)\d+(?=>)/g)?.[0];
                                const emojiObject = interaction.guild.emojis.cache.get(emojiId);

                                if (!emojiObject || !emojiObject.url) {
                                    const newEmojiObject = await interaction.client.emojis.cache.get(emojiId);
                                    if (!newEmojiObject || !newEmojiObject.url) {
                                        // If it's an animated emoji
                                        if (emojiInput.startsWith('<a:')) {
                                            newIconURL = `https://cdn.discordapp.com/emojis/${emojiId}.gif`;
                                        } else {
                                            // Try different extensions for static emoji
                                            const extensions = ['webp', 'png', 'jpg'];
                                            for (const extension of extensions) {
                                                const response = await fetch(`https://cdn.discordapp.com/emojis/${emojiId}.${extension}`);
                                                if (response.ok) {
                                                    newIconURL = `https://cdn.discordapp.com/emojis/${emojiId}.${extension}`;
                                                    break;
                                                }
                                            }

                                            if (!newIconURL) {
                                                return await interaction.reply({content: 'Unable to find the emoji\'s image ID.', ephemeral: true});
                                            }
                                        }
                                    } else {
                                        newIconURL = newEmojiObject.url;
                                    }
                                } else {
                                    newIconURL = emojiObject.url;
                                }
                                break;
                        }

                        await specialRole.setIcon(newIconURL);
                        return await interaction.reply({content: `Changed icon to: ${newIconURL}`, ephemeral: true});
                    }
                    else if (subcommand === 'help') {
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