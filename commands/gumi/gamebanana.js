const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const pm2Metrics = require('../../utils/pm2metrics.js');
const { config } = require('../../config.json');
const log = require('../../utils/logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamebanana')
        .setDescription('Searches for a mod in the MegaMix+ section of Gamebanana')
        .setDescriptionLocalizations({
            de: 'Sucht nach einem Mod im MegaMix+-Bereich von Gamebanana',
            'en-GB': 'Searches for a mod in the MegaMix+ section of Gamebanana',
            'en-US': 'Searches for a mod in the MegaMix+ section of Gamebanana',
            'es-ES': 'Busca un mod en la sección MegaMix+ de Gamebanana',
            fr: 'Recherche un mod dans la section MegaMix+ de Gamebanana',
            nl: 'Zoekt naar een mod in het MegaMix+-gedeelte van Gamebanana',
            'pt-BR': 'Procura um mod na seção MegaMix+ do Gamebanana',
            'zh-CN': '在 Gamebanana 的 MEGA39\'s+ 部分搜索模组',
            ja: 'GamebananaのMEGA39\'s+セクションでModを検索します',
            'zh-TW': '在 Gamebanana 的 MEGA39\'s+ 區域搜尋模組',
            ko: 'Gamebanana의 MEGA39\'s+ 섹션에서 모드 검색',
        })
        .setNameLocalizations({
            ja: 'gamebananaで検索する',
            ko: 'gamebanana에서검색',
            'zh-CN': '在gamebanana上搜索',
            'zh-TW': '在gamebanana上搜尋',
        })
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The mod name or submission ID to search for')
                .setDescriptionLocalizations({
                    de: 'Der Mod-Name oder die Einreichungs-ID, nach der gesucht werden soll',
                    'en-GB': 'The mod name or submission ID to search for',
                    'en-US': 'The mod name or submission ID to search for',
                    'es-ES': 'El nombre del mod o la ID de la presentación que se va a buscar',
                    fr: 'Le nom du mod ou l\'ID de la soumission à rechercher',
                    nl: 'De modnaam of inzendings-ID om naar te zoeken',
                    'pt-BR': 'O nome do mod ou o ID de submissão a ser procurado',
                    'zh-CN': '要搜索的模组名称或提交 ID',
                    ja: '検索するModの名前または提出ID',
                    'zh-TW': '要搜尋的模組名稱或提交 ID',
                    ko: '검색할 모드 이름 또는 제출 ID',
                })
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.SEND_MESSAGES)
        .setDMPermission(true),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        await interaction.deferReply();
        // const apiPassword = fs.readFileSync('api_password.txt', 'utf8').trim();
        // const appID = fs.readFileSync('app_id.txt', 'utf8').trim();
        // const userID = fs.readFileSync('user_id.txt', 'utf8').trim();
        //
        // const authenticateRes = await fetch(`https://api.gamebanana.com/Core/App/Authenticate?api_password=${apiPassword}&app_id=${appID}&userid=${userID}`)
        // .then(res => res.json());
        //
        // console.log(`Logged into the GameBanana API as ${authenticateRes[0]}`)
        // // if (!authenticateRes.success) {
        //
        // //     return interaction.reply({ content: 'Failed to authenticate with Gamebanana API.', ephemeral: true });
        //
        // // }
        // const aat = await fetch(`https://api.gamebanana.com/Core/List/Section/AllowedFilters?itemtype=Mod `, {
        //     headers: {
        //         Authorization: `Token ${authenticateRes[0]}`,
        //     },
        // }).then(res => res.json());
        // console.log("test")
        // console.log(aat);

        const results = await fetch(`https://gamebanana.com/apiv10/Game/16522/Subfeed?_nPage=1&_nPerpage=10&_sSort=default&_sName=${query}`).then(res => res.json());

        //console.log(searchRes);
        // if (!searchRes.success) {
        //     return interaction.reply('Failed to search for mods on Gamebanana');
        // }




        var embeds = [];
        i = 0;
        for (const mod of results._aRecords) {
            i++;
            if (i >= 10) {
                break;
            }
            const modInfo = await fetch(`https://gamebanana.com/apiv10/Mod/${mod._idRow}/ProfilePage`).then(res => res.json());
            const embed = new EmbedBuilder()
                .setColor(0x86cecb)
                .setAuthor({name: "GameBanana Search", iconURL: `${modInfo._aCategory._sIconUrl}`})
                .setTitle(`${modInfo._sName}`)
                .setURL(`${modInfo._sProfileUrl}`)
                .setThumbnail(`${modInfo._aPreviewMedia._aImages[0]._sBaseUrl}/${modInfo._aPreviewMedia._aImages[0]._sFile}`)
                .setTimestamp(new Date(modInfo._tsDateAdded * 1000))
                .addFields(
                    {name: 'Submitter', value: `${modInfo._aSubmitter._sName}`, inline: true},
                    {
                        name: 'Likes',
                        value: `${modInfo._nLikeCount !== undefined ? modInfo._nLikeCount : 0}`,
                        inline: true
                    },
                    {
                        name: 'Views',
                        value: `${modInfo._nViewCount !== undefined ? modInfo._nViewCount : 0}`,
                        inline: true
                    },
                )
                .setFooter({text: `${mikuBotVer}`})
            if (modInfo._sDescription !== undefined) {
                embed.setDescription(`${modInfo._sDescription}`);
            }
            if (modInfo._aAdditionalInfo._sversion !== undefined) {
                embed.addFields({name: 'Version', value: `${modInfo._aAdditionalInfo._sversion}`, inline: true});
            }
            var contentWarnings;

            if (modInfo._aContentRatings !== undefined) {
                for (var rating in modInfo._aContentRatings) {

                    if (modInfo._aContentRatings[rating] !== undefined) {
                        console.log(modInfo._aContentRatings[rating]);
                        if (contentWarnings === undefined) {
                            contentWarnings = `${modInfo._aContentRatings[rating]}`;
                        } else {
                            contentWarnings = `${contentWarnings}, ${modInfo._aContentRatings[rating]}`;
                        }
                    }
                }
                log.info(contentWarnings);
                log.info(modInfo._aContentRatings);

                embed.addFields({name: 'Content Warnings', value: `${contentWarnings}`, inline: true});
            }


            embeds.push(embed);


            await interaction.editReply({ content: `Found ${i} results...`});




        }

        if (embeds.length === 0) {
            embeds.push(new EmbedBuilder()
                .setColor(0xffc526)
                .setAuthor({name: "GameBanana Search", iconURL: "https://images.gamebanana.com/static/img/mascots/detective.png"})
                .setTitle("No results found.")
                .setFooter({ text: `${mikuBotVer}`})
            )
        }

        await interaction.editReply({ embeds: embeds, content: `` });

        // if (results.length === 0) {
        //     resultEmbed.setDescription('No results found.');
        // } else {
        //     for (let i = 0; i < results.length; i++) {
        //         const modRes = await fetch(`https://api.gamebanana.com/Core/Item/Data/?itemtype=Mod&itemid=${results[i]}&fields=creator,date,description,downloads,likes,name,studioid`, {
        //             headers: {
        //                 Authorization: `Token ${authenticateRes[0]}`,
        //             },
        //         }).then(res => res.json());
        //
        //         // if (!modRes.success) {
        //         //     return interaction.reply(`Failed to get data for mod with ID ${results[i]}`);
        //         // }
        //
        //         console.log(modRes)
        //
        //
        //     }
        // }

        //interaction.reply(`command not finished, check console for more details`);


    },
};
