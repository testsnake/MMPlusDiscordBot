const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gamebanana')
    .setDescription('Searches for a mod in the MegaMix+ section of Gamebanana')
    .addStringOption(option =>
        option.setName('query')
        .setDescription('The mod name or submission ID to search for')
        .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
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
                console.log(contentWarnings);
                console.log(modInfo._aContentRatings);

                embed.addFields({name: 'Content Warnings', value: `${contentWarnings}`, inline: true});
            }


            embeds.push(embed);


        }

        if (embeds.length === 0) {
            embeds.push(new EmbedBuilder()
                .setColor(0xffc526)
                .setAuthor({name: "GameBanana Search", iconURL: "https://images.gamebanana.com/static/img/mascots/detective.png"})
                .setTitle("No results found.")
                .setFooter({ text: `${mikuBotVer}`})
            )
        }

        await interaction.reply({ embeds: embeds });

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
