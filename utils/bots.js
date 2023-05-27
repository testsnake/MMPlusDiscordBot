const { Client, GatewayIntentBits} = require('discord.js');

function createBotClient() {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildVoiceStates,
        ]
    });
}


const mikuBot = createBotClient();
const rinBot = createBotClient();
const lenBot = createBotClient();
const lukaBot = createBotClient();
const kaitoBot = createBotClient();
const meikoBot = createBotClient();
const gumiBot = createBotClient();
const tetoBot = createBotClient();

const botArray = [
    {bot: mikuBot, name: 'miku', color: 0x86CECB, clientID: '1087852383477977219', activities: {name: 'Hatsune Miku: Project DIVA Mega Mix+', type: 'Playing'} },
    {bot: rinBot, name: 'rin', color: 0xFFCC11, clientID: '1105349186796408872', activities: {name: 'Spotify', type: 'Listening'} },
    {bot: lenBot, name: 'len', color: 0xFFEE12, clientID: '1105351152687661086', activities: {name: 'Hatsune Miku: Project Mirai DX', type: 'Playing'}},
    {bot: lukaBot, name: 'luka', color: 0xFFBACC, clientID: '1105347405395787887', activities: {name: 'Hatsune Miku Project DIVA: Mega Mix+', type: 'Playing'}},
    {bot: kaitoBot, name: 'kaito', color: 0x3367cd, clientID: '1105354346520137768', activities: {name: 'you', type: 'Watching'}},
    {bot: meikoBot, name: 'meiko', color: 0xDE4444, clientID:  '1105351576081670165', activities: {name: 'Spotify', type: 'Listening'}},
    {bot: gumiBot, name: 'gumi', color: 0x56D029, clientID: '1105355273255792761', activities: {name: 'Megpoid the Music♯', type: 'Playing'}},
    {bot: tetoBot, name: 'teto', color: 0xFF0045, clientID: '1105354732173803612', activities: {name: 'Hatsune Miku Project DIVA: Mega Mix+', type: 'Playing'}}
];

getBotByName = (botName) => {
    return botArray.find(botObj => botObj.name === botName);
}

module.exports = {
    botArray: botArray,
    getBotByName: getBotByName
}
