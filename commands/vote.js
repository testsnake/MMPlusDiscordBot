const fs = require('fs');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');


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
const votesFilePath = '../../votes.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('vote for the current event')
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
                    { name: '[M23] what is this world that we live in.', value: 'M9523' },
                    { name: '[M24] Teto Pipe Bomb', value: 'M9524' },
                    { name: '[M25] インパクトパイモンぬいぐるみランチブレイク...', value: 'M9525' },
                    { name: '[M26] Shout Out To The Gays', value: 'M9526' },
                    { name: '[M27] Blend W', value: 'M9527' },
                    { name: '[M28] 強風オールバック / Kyoufuu All Back', value: 'M9528' },
                    { name: '[M29] Whatsapp drip car', value: 'M9529' },
                    { name: '[M30] We Are Number One But Hatsune Miku Sings EVERYTHING', value: 'M9530' },
                    { name: '[M31] Axel F', value: 'M9531' },
                    { name: '[M32] miku walks to burger king', value: 'M9532' },
                    { name: '[M33] I Squeezed Out the Baby, Yet I Have No Idea Who the Father Is', value: 'S9533' },
                    { name: '[P34] Games', value: 'S9534' },
                    { name: '[P35] アネモネ / Anemone', value: 'S9535' },
                    { name: '[P36] All the Things She Said', value: 'S9536' },
                    { name: '[P37] 少女ケシゴム / Girl eraser', value: 'S9537' },
                    { name: '[P38] ロウワー / Lower One\'s Eyes', value: 'S9538' },
                    { name: '[P39] Sissy That Walk', value: 'S9539' },
                    { name: '[P40] ガールフレンド・イン・ブルー / Girlfriend in Blue', value: 'S9540' },
                    { name: '[P41] 威風堂々 / Ifuudoudou', value: 'S9541' },
                    { name: '[P42] 女の子になりたい / I Wanna Be A Girl', value: 'S9542' },
                    { name: '[P43] 冬のはなし / Fuyu No Hanashi', value: 'S9543' },
                    { name: '[P44] ドキドキ☆百合学園 / Heart-throbbing☆Yuri Academy', value: 'S9544' },
                    { name: '[P45] ヴィラン / Villain', value: 'S9545' },
                    { name: '[P46] Games', value: 'S9546' }
                ))
        .addStringOption((option) =>
            option
                .setName('addorremove')
                .setDescription('add or remove your vote')
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' },
                )
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        try {
            const vote = interaction.options.getString('chart');

            if (!vote) {
                // Return votes
                const votes = await readJSONFile(votesFilePath);
                if (!votes[userId]) {
                    return await interaction.reply({
                        content: 'You have not voted for any charts yet.',
                        ephemeral: true,
                    });
                } else {
                    const userVotes = votes[userId];
                    const voteList = [];
                    for (const prefix in userVotes) {
                        if (userVotes[prefix].length > 0) {
                            voteList.push(`${prefix}: ${userVotes[prefix].join(', ')}`);
                        }
                    }
                    return await interaction.reply({
                        content: `Your current votes are: ${voteList.join(' | ')}`,
                        ephemeral: true,
                    });
                }

            }


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
                        content: `You have already voted for ${userVotes[prefix].join(', ')}. You may only vote for 2 charts per category.`,
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


