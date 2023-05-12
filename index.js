// This file will replace all of the code in index-old.js


const fs = require('fs');
const path = require('path');

const { Client, Collect, Events, GatewayIntents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, GatewayIntentBits} = require('discord.js');
const { tokens } = require('./tokens.json');
const { config } = require('./config.json');
const utils = require('./utils.js');
const fetch = require('node-fetch');
const botVersion = fs.readFileSync('./versionID.txt', 'utf8');
const log = require('./logger.js');

const io = require('@pm2/io')

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
    {bot: mikuBot, name: 'miku'},
    {bot: rinBot, name: 'rin'},
    {bot: lenBot, name: 'len'},
    {bot: lukaBot, name: 'luka'},
    {bot: kaitoBot, name: 'kaito'},
    {bot: meikoBot, name: 'meiko'},
    {bot: gumiBot, name: 'gumi'},
    {bot: tetoBot, name: 'teto'}
];

const pm2Metrics = {
    liveBots: io.counter({
        name: 'Live Bots',
        id: 'liveBots',
    }),
    messagesReceived: io.counter({
        name: 'Messages Received',
        id: 'messagesReceived',
    }),
    actionsPerformed: io.counter({
        name: 'Actions Performed',
        id: 'actionsPerformed',
    }),
    errors: io.counter({
        name: 'Errors',
        id: 'errors',
    }),
    commandsLoaded: io.counter({
        name: 'Commands Loaded',
        id: 'commandsLoaded',

    }),
    commandsErrored: io.counter({
        name: 'Commands Errored',
        id: 'commandsErrored',
    }),
    eventsLoaded: io.counter({
        name: 'Events Loaded',
        id: 'eventsLoaded',
    }),
    eventsErrored: io.counter({
        name: 'Events Errored',
        id: 'eventsErrored',
    }),
}

// Sends an error message via Discord and pings the bot owner
async function errorAlert(definedErrorMessage, code, error, botName) {
    try {
        const loggingChannel = await mikuBot.channels.cache.get(config.loggingChannel);

        const errorEmbed = new EmbedBuilder()
            .setTitle(`[${botName}] Error ${definedErrorMessage} ${code}`)
            .setDescription(`${utils.ts(error, 2047)}`)
            .setColor(0xFF0000)
            .setTimestamp();

        await loggingChannel.send({embeds: [errorEmbed], content: `<@${config.ownerID}>`});
    } catch (error) {
        log.error(`[${botName}] Failed to send error alert: ${error}`);
    }

}

// Self-explanatory
async function loadCommandsAndEvents() {
    const commandsPath = path.join(__dirname, 'commands');

    // Load commands for each bot in commands/[botname]
    for (const botObj of botArray) {
        const bot = botObj.bot;
        const botName = botObj.name;

        bot.commands = new Map();

        const commandFiles = await fs.promises.readdir(path.join(commandsPath, botName));
        const jsCommandFiles = commandFiles.filter(file => file.endsWith('.js'));

        for (const file of jsCommandFiles) {
            try {
                const command = require(path.join(commandsPath, botName, file));
                log.info(`[${botName}] Loaded ${command.data.name} command in ${path.join(commandsPath, botName, file)}`);
                if ('data' in command && 'execute' in command) {
                    bot.commands.set(command.data.name, command);

                } else {
                    log.error(`[${botName}] Failed to load ${command.data.name} command: missing data or execute`);
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} command: ${error}`);
            }
        }
    }

    const eventPath = path.join(__dirname, 'events');

    // Load events for each bot in events/[botname]
    for (const botObj of botArray) {
        const bot = botObj.bot;
        const botName = botObj.name;

        const eventFiles = await fs.promises.readdir(eventPath);
        const jsEventFiles = eventFiles.filter(file => file.endsWith('.js'));

        for (const file of jsEventFiles) {
            try {
                const event = require(path.join(eventPath, file));
                if ('name' in event && 'execute' in event) {
                    bot.on(event.name, (...args) => event.execute(...args, bot, botName));
                    log.info(`[${botName}] Loaded ${event.name} event in ${path.join(eventPath, file)}`);
                } else {
                    log.error(`[${botName}] Failed to load ${event.name} event: missing name or execute`);
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} event: ${error}`);
            }
        }
    }
}


// Start the system
async function startSystem() {
    // Login to all bots
    await Promise.all(botArray.map(async (botObj) => {
        const bot = botObj.bot;
        const botName = botObj.name;

        try {
            await bot.login(tokens[botName]);
            log.info(`[${botName}] Logged in as ${bot.user.tag}`);
        } catch (error) {
            log.error(`[${botName}] Failed to login: ${error}`);
            // Remove bot from botArray to avoid further errors
            botArray.splice(botArray.indexOf(botObj), 1);
        }
    })).then(async () => {
        log.info('All bots logged in');
        // Load commands and events
        await loadCommandsAndEvents();
        log.info('Commands and events loaded');
    });
}


(async () => {
    await startSystem();
})();


