const fs = require('fs');
const fetch = require('node-fetch');
const {addLog, getRecentLogs} = require('./logManager');
const {EmbedBuilder} = require('discord.js');
const {delay, sendMsg, sendAutoPublishEmbed} = require('./utils');
const {errorAlert} = require("./utils.js");
const {ts} = require("./utils");
const { botArray} = require("./bots.js");
const config = require('./config.json');

// let client;

const log = require('./logger.js');


const timestampFile = 'latestTimestamp.txt';
let feedEnabled = true;
let latestTimestamp;
let latestTimestampTemp;
try {
    latestTimestamp = parseInt(fs.readFileSync(timestampFile, 'utf8'));
} catch (err) {
    latestTimestamp = new Date().getTime() / 1000;
    fs.writeFileSync(timestampFile, latestTimestamp.toString());
}

let attemptsToReconnect = 0;
let firstRun = true;

async function checkGamebananaFeed() {
    // client = mikuBot;
    // Check Gamebanana feed for new items
    // This is probably a terrible way to do this, but it works.

    if (feedEnabled) {
        // if latest timestamp is undefined, null, in the future, or more than 1 hour ago, set it to 1 hour ago
        if (latestTimestamp === undefined || latestTimestamp === null || latestTimestamp > (new Date().getTime() / 1000) || latestTimestamp < (new Date().getTime() / 1000) - 3600) {
            latestTimestamp = (new Date().getTime() / 1000) - 3600;
            fs.writeFileSync(timestampFile, latestTimestamp.toString());
        }


        await checkGamebananaAPI('new').then(async (newItems) => {
            await checkGamebananaAPI('updated').then(async (updatedItems) => {
                latestTimestamp = Math.max(newItems, updatedItems);
                fs.writeFileSync(timestampFile, latestTimestamp.toString());
            });
        });
    } else {
        log.info("Gamebanana feed is disabled");
    }
}

async function checkGamebananaAPI(sort) {
    try {

        log.info(`Checking Gamebanana API for ${sort} items...`);
        log.info(`Latest timestamp: ${latestTimestamp}`);
        let response
        try {
            response = await fetch(`https://gamebanana.com/apiv10/Game/16522/Subfeed?_nPage=1&_nPerpage=10&_sSort=${sort}`);
            if (response.status !== 200) {
                throw new Error(`Gamebanana API returned status code ${response.status}`);
            }
            attemptsToReconnect = 0;
        } catch (err) {
            addLog(`[Gamebanana error 002 at ${new Date()}]\n${ts(err, 1800)}...`);
            await errMsg(err, "Gamebanana API", `response: ${ts(response, 1800)}...`);
            if (attemptsToReconnect < 3 || (attemptsToReconnect > 3 && attemptsToReconnect < 10)) {
                attemptsToReconnect++;
                log.warning("Error fetching Gamebanana API, reconnecting...");
                await new Promise(resolve => setTimeout(resolve, 20000));
                return await checkGamebananaAPI(sort);
            } else if (attemptsToReconnect === 10) {
                addLog(`[Gamebanana error 001 at ${new Date()}]\n${ts(err, 1800)}...`);
                addLog(`giving up on reconnecting to Gamebanana API`);
                log.error("Error fetching Gamebanana API, giving up on reconnecting");
                return 0;

            } else {
                attemptsToReconnect++;
                // await client.channels.fetch(`1087783783207534604`).then(async (feedChannel) => {
                //     try {
                //         await feedChannel.send(`An error occurred while fetching the Gamebanana API. Mods may not appear in the feed until this is resolved. (<@$201460040564080651>)`);
                //     } catch (err) {
                //         log.error("Error sending message about Gamebanana API error")
                //         log.error(err);
                //         await errorAlert("Error sending message about Gamebanana API error", "040", err, `GameBanana`)
                //     }
                // });
                await sendMsg(undefined, `An error occurred while fetching the Gamebanana API. Mods may not appear in the feed until this is resolved. (<@201460040564080651>)`, `${config.feedChannelID}`);
            }
        }

        let data;
        try {
            data = await response.json();
        } catch (err) {
            log.error("Error parsing JSON");
            log.error(err);
            addLog(`[Gamebanana error 003 at ${new Date()}]\n${ts(JSON.stringify(response), 1800)}...`);
            await errorAlert("Error parsing JSON", "003", err, `GameBanana`)

            return 0;
        }
        latestTimestampTemp = latestTimestamp;
        if (data._aRecords && data._aRecords.length > 0) {
            if (firstRun) {
                log.info("First run, skipping all records.")
                //latestTimestamp = Math.max(...data._aRecords.map(record => Math.max(record._tsDateAdded, record._tsDateUpdated))) + 1;
                firstRun = false;
            }
            if (true) { // Remove this once done debugging
                for (const record of data._aRecords) {
                    if (isNaN(record._tsDateUpdated)) {
                        record._tsDateUpdated = 0;
                    }
                    const currentTimestamp = Math.max(record._tsDateAdded, record._tsDateUpdated);

                    if (currentTimestamp > latestTimestamp) {

                        let isNew = false;
                        if (sort === "new") isNew = true;

                        // Process the new or updated record
                        await processRecord(record, isNew);
                    } else {
                        console.log(`${currentTimestamp}\tSkipping record: ${record._sName}`)
                    }

                    latestTimestampTemp = Math.max(currentTimestamp, latestTimestamp, latestTimestampTemp);

                }
            }
        }
        log.info(`Latest timestamp: ${latestTimestampTemp}`)
        return latestTimestampTemp;

    } catch (err) {
        log.error("Error checking Gamebanana API");
        await errorAlert("Error checking Gamebanana API", "000", err, `GameBanana`)

    }
}




async function processRecord(modInfo, isNew) {
    try {
        let subType = modInfo._sSingularTitle;
        if (subType === "WiP") {
            subType = "Wip";
        }


    } catch (err) {
        log.error("Error processing record");
    }
}

async function showRecord(subType, submissionId, isNew) {
    try {


        let modInfo = await fetch(`https://gamebanana.com/apiv10/${subType}/${submissionId}/ProfilePage`).then(res => {
            if (res.status !== 200) {
                throw new Error(`Gamebanana API returned status code ${res.status}`);
            }
            res.json()
        });


        try {
            if (modInfo._nUpdatesCount > 0) {
                isNew = false;
            }
        } catch (err) {
            isNew = false;
        }

        let updateInfo;
        let changeLog = "";
        let changeLogTitle = "Changelog";
        let hasChangeLog = false;
        let changeLogDescription = "";
        if (!isNew) {
            try {
                updateInfo = await fetch(`https://gamebanana.com/apiv10/${subType}/${modInfo._idRow}/Updates`).then(res => {
                    if (res.status !== 200) {
                        log.error(`Gamebanana API returned status code ${res.status}`);

                        throw new Error(`Gamebanana API returned status code ${res.status}`);
                    }
                    res.json()
                });
                let changeLog1;
                if (updateInfo._aRecords[0]._aChangeLog) {
                    changeLog1 = updateInfo._aRecords[0]._aChangeLog.map(entry => `**${entry.cat}** - ${entry.text}`);
                    changeLog = changeLog1.join('\n');
                    addLog(`Changelog added for mod ${modInfo._sName}:\n${changeLog}`)
                } else {
                    addLog(`No changelog found for mod ${modInfo._sName}:\n${JSON.stringify(updateInfo)}`)
                }

                changeLogTitle = updateInfo._aRecords[0]._sName;
                changeLogTitle = changeLogTitle !== undefined ? changeLogTitle : "Update";

                changeLogDescription = updateInfo._aRecords[0]._sText;
                changeLogDescription = changeLogDescription !== undefined ? '\n' + changeLogDescription.replace(/<[^>]*>/g, '') : "";
                if (changeLog.length > 0 && changeLogDescription.length > 0) {
                    hasChangeLog = true;
                }

            } catch (err) {
                log.error("Error getting changelog");
                log.error(err);
                await errorAlert("Error getting changelog", "006", err, `GameBanana`)
            }
        }

        await new Promise(r => setTimeout(r, 1000));
        log.info(`Processing record: ${modInfo._sName}`)
        // while (!client.channels.cache.get(`1087783783207534604`)) {
        //     log.info("Waiting for feed channel to be ready")
        //     await new Promise(r => setTimeout(r, 1000));
        // }
        addLog(`{ProcessRecord at ${new Date()}}\nisNew: ${isNew}\n${JSON.stringify(modInfo)}`);

        // await client.channels.cache.get(`1087783783207534604`).then(async (feedChannel) => {
        //
        //     if (!feedChannel) {
        //         log.error("Error getting feed channel");
        //         await errorAlert("Error getting feed channel", "006", "Error getting field channel", `GameBanana`)
        //         return
        //     }
        //     addLog(`[Feed channel at ${new Date()}] ${feedChannel}`);
            let embed;
            const pathname = new URL(modInfo._sProfileUrl).pathname;
            const modsSection = pathname.split("/")[1];
            const modId = pathname.split("/")[2];


            log.info(`[${modInfo._sName}] New mod found at: ${pathname}`);
            addLog(`[${modInfo._sName}] New mod found at: ${pathname}`);
            embed = new EmbedBuilder()
                .setTitle(`${ts(modInfo._sName, 255)}`)
                .setURL(`${modInfo._sProfileUrl}`)

                .setTimestamp(new Date(modInfo._tsDateAdded * 1000))
                .addFields(
                    {name: 'Submitter', value: `${ts(modInfo._aSubmitter._sName, 255)}`, inline: true},
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
                .setFooter({text: `${config.botVer}`})
            if (modInfo._sDescription !== undefined) {
                embed.setDescription(`${ts(modInfo._sDescription, 4095)}`);
                log.verbose(`[${modInfo._sName}] Description: ${modInfo._sDescription}`);
            }
            try {
                if (modInfo._aAdditionalInfo._sVersion) {
                    embed.addFields({name: 'Version', value: `${modInfo._aAdditionalInfo._sVersion}`, inline: true});
                    log.verbose(`[${modInfo._sName}] Version: ${modInfo._aAdditionalInfo._sVersion}`);
                }
            } catch (err) {
                log.error(`[${modInfo._sName}] Version: undefined`);
                addLog(`[${modInfo._sName}] Version: could not be found and caused an error`);
            }

            if (modInfo._aPreviewMedia._aImages && modInfo._aPreviewMedia._aImages[0]._sBaseUrl && modInfo._aPreviewMedia._aImages[0]._sFile) {
                embed.setThumbnail(`${modInfo._aPreviewMedia._aImages[0]._sBaseUrl}/${modInfo._aPreviewMedia._aImages[0]._sFile}`)
            }

            let contentWarnings;

            if (modInfo._aContentRatings !== undefined) {
                log.verbose(`[${modInfo._sName}] Content Ratings: ${modInfo._aContentRatings}`)
                for (var rating in modInfo._aContentRatings) {

                    if (modInfo._aContentRatings[rating] !== undefined) {
                        console.log(`[${modInfo._sName}] Content Ratings: ${modInfo._aContentRatings[rating]}`);
                        if (contentWarnings === undefined) {
                            contentWarnings = `${modInfo._aContentRatings[rating]}`;
                        } else {
                            contentWarnings = `${contentWarnings}, ${modInfo._aContentRatings[rating]}`;
                        }
                    }
                }
                log.verbose(`[${modInfo._sName}] Content Warnings: ${contentWarnings}`)

                embed.addFields({name: 'Content Warnings', value: `${ts(contentWarnings, 1023)}`, inline: true});
            }

            try {
                if (!isNew) {
                    embed.setAuthor({name: `${subType} Updated`, iconURL: `${modInfo._aCategory._sIconUrl}`})
                        .setColor(0x86cecb)
                    log.verbose(`[${modInfo._sName}] ${subType} Updated: ${modInfo._tsDateUpdated}`)

                } else {
                    embed.setAuthor({name: `New ${subType}`, iconURL: `${modInfo._aCategory._sIconUrl}`})
                        .setColor(0x6bed78)
                    log.verbose(`[${modInfo._sName}] New ${subType}: ${modInfo._tsDateAdded}`)

                }

            } catch (e) {
                if (!isNew) {
                    embed.setAuthor({name: `${subType} Updated`, iconURL: "https://i.imgur.com/iJDHCx2.png"})
                        .setColor(0x86cecb)
                    log.verbose(`[${modInfo._sName}] ${subType} Updated: ${modInfo._tsDateUpdated}`)

                } else {
                    embed.setAuthor({name: `New ${subType}`, iconURL: "https://i.imgur.com/eJyrdy7.png"})
                        .setColor(0x6bed78)
                    log.verbose(`[${modInfo._sName}] New ${subType}: ${modInfo._tsDateAdded}`)

                }
            }

            if (hasChangeLog) {
                try {
                    embed.addFields({
                        name: `${changeLogTitle} changelog`,
                        value: `${ts(`${changeLog}${changeLogDescription}`, 1023)}`,
                        inline: false
                    });
                } catch (err) {
                    addLog(`[${modInfo._sName}] Error while adding changelog: ${modInfo._sName}}`);
                }
            }

            addLog(`[${modInfo._sName}] New ${subType} found: ${modInfo._sName} by ${modInfo._aSubmitter._sName} at ${modInfo._sProfileUrl}`);

            if (embed === undefined || embed === null) {
                log.error(`[${modInfo._sName}] Error while creating embed: ${modInfo._sName}}`);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            log.info(`[${modInfo._sName}] Sending embed: ${modInfo._sName}}`)
            try {
                return await sendAutoPublishEmbed(undefined, embed, config.feedChannelID)
            } catch (err) {
                log.error(`[${modInfo._sName}] Error while sending embed: ${modInfo._sName}}`);
                log.error(err);
                await errorAlert("Error while sending embed", "009", err, "Gamebanana")
                return err;


            }

        // })
    } catch (err) {
        log.error(`Error while checking GameBanana feed: ${err}`)
        return err;
    }
}

async function setFeedTimestamp(timestamp = -1) {
    try {
        latestTimestamp = timestamp;
        fs.writeFileSync(timestampFile, latestTimestamp.toString());
        return latestTimestamp;
    } catch (err) {
        log.error(`Error while setting timestamp: ${err}`)
        return -1;
    }

}

async function getTimestamp() {
    try {
        return latestTimestamp;
    } catch (err) {
        log.error(`Error while reading timestamp: ${err}`)
        return -1;
    }
}

async function toggleFeed() {
    feedEnabled = !feedEnabled;
    log.info(feedEnabled);
    return feedEnabled;
}

async function manuallyProcessRecord(subType, modId, isNew) {
    return await showRecord(subType, modId, isNew);
}

module.exports = {
    checkGamebananaFeed: checkGamebananaFeed,
    setFeedTimestamp: setFeedTimestamp,
    getTimestamp: getTimestamp,
    toggleFeed: toggleFeed,
    manuallyProcessRecord: manuallyProcessRecord
}
