const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

// Functions to read and write the JSON file
function readJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // Create an empty JSON file if it doesn't exist
                    fs.writeFile(filePath, JSON.stringify({}), 'utf8', (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({});
                        }
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}


function writeJSONFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Define the votes file path
const votesFilePath = './votes.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('vote for the current event')
        .setNameLocalizations({
            'es-ES': 'votar',
            fr: 'voter',
            nl: 'stemmen',
            'pt-BR': 'votar',
            'zh-CN': '投票',
            ja: '投票',
            'zh-TW': '投票',
            ko: '투표',
        })
        .setDescription('vote for the current event')
        .setDescriptionLocalizations({
            de: 'Stimmen Sie für das aktuelle Ereignis ab',
            'en-GB': 'vote for the current event',
            'en-US': 'vote for the current event',
            'es-ES': 'vota por el evento actual',
            fr: 'votez pour l\'événement en cours',
            nl: 'stem voor het huidige evenement',
            'pt-BR': 'vote para o evento atual',
            'zh-CN': '为当前事件投票',
            ja: '現在のイベントに投票する',
            'zh-TW': '為當前事件投票',
            ko: '현재 이벤트에 투표하십시오',
        })
        .addStringOption((option) =>
            option
                .setName('chart')
                .setDescription('the chart you want to vote on')
                .setChoices(
                    { name: 'M00', value: 'M9500' },
                    { name: 'M01', value: 'M9501' },
                    { name: 'M02', value: 'M9502' },
                    { name: 'M03', value: 'M9503' },
                    { name: 'M04', value: 'M9504' },
                    { name: 'M05', value: 'M9505' },
                    { name: 'M06', value: 'M9506' },
                    { name: 'M07', value: 'M9507' },
                    { name: 'M08', value: 'M9508' },
                    { name: 'M09', value: 'M9509' },
                    { name: 'S10', value: 'S9510' },
                    { name: 'S11', value: 'S9511' },
                    { name: 'S12', value: 'S9512' },
                    { name: 'S13', value: 'S9513' },
                    { name: 'S14', value: 'S9514' },
                    { name: 'S15', value: 'S9515' },
                    { name: 'S16', value: 'S9516' },
                    { name: 'S17', value: 'S9517' },
                    { name: 'S18', value: 'S9518' },
                    { name: 'S19', value: 'S9519' },
                    { name: 'S20', value: 'S9520' },
                    { name: 'S21', value: 'S9521' },
                    { name: 'S22', value: 'S9522' },
                )
                .setRequired(true))
        .addStringOption((option) =>
            option
                .setName('addorremove')
                .setDescription('add or remove your vote')
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' },
                )
        ),

    async execute(interaction) {const userId = interaction.user.id;
        try {
            const vote = interaction.options.getString('chart');
            const addorremove = interaction.options.getString('addorremove') || 'add';

            // Read votes from the JSON file
            const votes = await readJSONFile(votesFilePath);

            // Initialize user's votes if not already in the database
            if (!votes[userId]) {
                votes[userId] = {
                    M: [],
                    S: [],
                };
            }

            const userVotes = votes[userId];
            const prefix = vote[0];

            if (addorremove === 'add') {
                if (userVotes[prefix].length >= 2) {
                    return await interaction.reply({
                        content: `You have already voted for ${userVotes[prefix].join(', ')}.`,
                        ephemeral: true,
                    });
                }

                if (!userVotes[prefix].includes(vote)) {
                    userVotes[prefix].push(vote);
                }

                await interaction.reply({
                    content: `Your vote for ${vote} has been added.`,
                    ephemeral: true,
                });
            } else {
                const index = userVotes[prefix].indexOf(vote);

                if (index !== -1) {
                    userVotes[prefix].splice(index, 1);
                    await interaction.reply({
                        content: `Your vote for ${vote} has been removed.`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: `You haven't voted for ${vote}.`,
                        ephemeral: true,
                    });
                }
            }

            // Save the updated votes to the JSON file
            await writeJSONFile(votesFilePath, votes);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }

    },
};


