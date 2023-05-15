const fs = require('fs');
const path = require('path');

const { Client, Collect, Events, GatewayIntents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, GatewayIntentBits,
    ActivityType
} = require('discord.js');
const { REST, Routes } = require('discord.js');
const tokens = require('./tokens.json');
const config = require('./config.json');
const utils = require('./utils.js');
const fetch = require('node-fetch');
const botVersion = fs.readFileSync('./versionID.txt', 'utf8');
const log = require('./logger.js');
const pm2Metrics = require('./pm2metrics.js');
const { checkGamebananaFeed } = require('./gamebanana.js');

const {sendEmbed, getString} = require("./utils");

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
    {bot: mikuBot, name: 'miku', color: 0x86CECB, clientID: '1087852383477977219', activities: {name: 'Hatsune Miku: Project DIVA Mega Mix+', type: 'Playing'} },
    {bot: rinBot, name: 'rin', color: 0xFFCC11, clientID: '1105349186796408872', activities: {name: 'Spotify', type: 'Listening'} },
    {bot: lenBot, name: 'len', color: 0xFFEE12, clientID: '1105351152687661086', activities: {name: 'Hatsune Miku: Project Mirai DX', type: 'Playing'}},
    {bot: lukaBot, name: 'luka', color: 0xFFBACC, clientID: '1105347405395787887', activities: {name: 'Hatsune Miku Project DIVA: Mega Mix+', type: 'Playing'}},
    {bot: kaitoBot, name: 'kaito', color: 0x3367cd, clientID: '1105354346520137768', activities: {name: 'you', type: 'Watching'}},
    {bot: meikoBot, name: 'meiko', color: 0xDE4444, clientID:  '1105351576081670165', activities: {name: 'Spotify', type: 'Listening'}},
    {bot: gumiBot, name: 'gumi', color: 0x56D029, clientID: '1105355273255792761', activities: {name: 'Megpoid the Music♯', type: 'Playing'}},
    {bot: tetoBot, name: 'teto', color: 0xFF0045, clientID: '1105354732173803612', activities: {name: 'Hatsune Miku Project DIVA: Mega Mix+', type: 'Playing'}}
];



/*
    * Error Alert
    * Sends an error alert to the error channel
    * @param {string} definedErrorMessage - The error message defined in the code
    * @param {string} code - The error code
    * @param {string} error - The error message
    * @param {string} botName - The name of the bot that the error occurred in
 */
async function errorAlert(definedErrorMessage, code, error, botName) {
    try {

        const errorEmbed = new EmbedBuilder()
            .setTitle(`[${botName}] Error ${definedErrorMessage} ${code}`)
            .setDescription(`${utils.ts(error, 2047)}`)
            .setColor(0xFF0000)
            .setTimestamp();

        await sendEmbed(botArray[0].bot, errorEmbed);
    } catch (error) {
        log.error(`[${botName}] Failed to send error alert: ${error}`);
    }

}

/*
    * Load Commands and Events
 */
async function loadCommandsAndEvents() {
    const commandsPath = path.join(__dirname, 'commands');

    // Load commands for each bot in commands/[botname]
    for (const botObj of botArray) {
        const bot = botObj.bot;
        const botName = botObj.name;

        bot.commands = new Map();

        let commandRegistry = [];

        const commandFiles = await fs.promises.readdir(path.join(commandsPath, botName));
        const jsCommandFiles = commandFiles.filter(file => file.endsWith('.js'));
        const rest = new REST({ version: '10' }).setToken(tokens[botName]);

        for (const file of jsCommandFiles) {
            try {
                const command = require(path.join(commandsPath, botName, file));
                commandRegistry.push(command.data.toJSON());


                log.info(`[${botName}] Loaded ${command.data.name} command in ${path.join(commandsPath, botName, file)}`);



                log.info(`[${botName}] Loaded ${command.data.name} command in ${path.join(commandsPath, botName, file)}`);
                if ('data' in command && 'execute' in command) {
                    bot.commands.set(command.data.name, command);
                    pm2Metrics.commandsLoaded.inc();

                } else {
                    log.error(`[${botName}] Failed to load ${command.data.name} command: missing data or execute`);
                    pm2Metrics.commandsErrored.inc();
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} command: ${error}`);
                pm2Metrics.commandsErrored.inc();
            }
        }
        // Load shared commands in commands/global
        const globalCommandFiles = await fs.promises.readdir(path.join(commandsPath, 'global'));
        const jsGlobalCommandFiles = globalCommandFiles.filter(file => file.endsWith('.js'));

        for (const file of jsGlobalCommandFiles) {
            try {
                const command = require(path.join(commandsPath, "global", file));
                commandRegistry.push(command.data.toJSON());


                log.info(`[${botName}] Loaded ${command.data.name} command in ${path.join(commandsPath, "global", file)}`);



                log.info(`[${botName}] Loaded ${command.data.name} command in ${path.join(commandsPath, "global", file)}`);
                if ('data' in command && 'execute' in command) {
                    bot.commands.set(command.data.name, command);
                    pm2Metrics.commandsLoaded.inc();

                } else {
                    log.error(`[${botName}] Failed to load ${command.data.name} command: missing data or execute`);
                    pm2Metrics.commandsErrored.inc();
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} command: ${error}`);
                pm2Metrics.commandsErrored.inc();
            }
        }
        log.info(`[${botName}] Loaded ${bot.commands.size} commands.`)

        const guild = config.guildID;
        log.debug(`[${botName}] Registering application commands in guild ${guild}`);
        // log.debug(`[${botName}] Application commands: ${JSON.stringify(commandRegistry)}`);
        
        const data = await rest.put(
            Routes.applicationCommands(botObj.clientID, guild),
            { body: commandRegistry },
        ).catch(error => {
            log.error(`[${botName}] Failed to register application commands: ${error}`);
            pm2Metrics.commandsErrored.inc();
        }

    );
        log.info(`[${botName}] Successfully registered application commands. ${data.length} commands registered.`);
    }

    const eventPath = path.join(__dirname, 'events');

    // Load events for each bot in events/[botname] as well as the shared events in /events/
    for (const botObj of botArray) {
        const bot = botObj.bot;
        const botName = botObj.name;


        //loads global events
        let globalEventFiles = await fs.promises.readdir(path.join(eventPath));
        const jsGlobalEventFiles = globalEventFiles.filter(file => file.endsWith('.js'));

        for (const file of jsGlobalEventFiles) {
            try {
                const event = require(path.join(eventPath, file));
                log.info(`[${botName}] Loading ${event.name} event in ${path.join(eventPath, file)}`);
                if ('name' in event && 'execute' in event) {
                    bot.on(event.name, (...args) => event.execute(...args, bot, botName));
                    log.info(`[${botName}] Loaded ${event.name} event in ${path.join(eventPath, file)}`);
                    pm2Metrics.eventsLoaded.inc();
                } else {
                    log.error(`[${botName}] Failed to load ${event.name} event: missing name or execute`);
                    pm2Metrics.eventsErrored.inc();
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} event: ${error}`);
                pm2Metrics.eventsErrored.inc();
            }
        }


        //loads bot specific events

        let eventFiles = await fs.promises.readdir(path.join(eventPath, botName));
        const jsEventFiles = eventFiles.filter(file => file.endsWith('.js'));

        for (const file of jsEventFiles) {
            try {
                const event = require(path.join(eventPath, botName, file));
                log.info(`[${botName}] Loading ${event.name} event in ${path.join(eventPath, botName, file)}`);
                if ('name' in event && 'execute' in event) {
                    bot.on(event.name, (...args) => event.execute(...args, bot, botName));
                    log.info(`[${botName}] Loaded ${event.name} event in ${path.join(eventPath, botName, file)}`);
                    pm2Metrics.eventsLoaded.inc();
                } else {
                    log.error(`[${botName}] Failed to load ${event.name} event: missing name or execute`);
                    pm2Metrics.eventsErrored.inc();
                }
            } catch (error) {
                log.error(`[${botName}] Failed to load ${file} event: ${error}`);
                pm2Metrics.eventsErrored.inc();
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
        const botColor = botObj.color;
        const activity = botObj.activities;
        const game = activity.name;
        const type = activity.type;

        try {
            const token = tokens[botName];
            await bot.login(token);
            log.info(`[${botName}] Logged in as ${bot.user.tag}`);
            pm2Metrics.liveBots.inc();
            const loginEmbed = new EmbedBuilder()
                .setTitle(`[${botName}] Bot Started`)
                .setDescription(`${await getString(botName, 'botStarted')}`)
                .setColor(botColor)
                .setTimestamp();
            const logChannel = await bot.channels.fetch(config.loggingChannelID);
            await logChannel.send({embeds: [loginEmbed]});

            const validActivityTypes = Object.keys(ActivityType).filter(key => isNaN(parseInt(key)));
            if (!validActivityTypes.includes(type)) {
                log.error(`[${botName}] Invalid activity type: ${type}`);
                pm2Metrics.errors.inc();
                await errorAlert('logging in', '000', `Invalid activity type: ${type}`, botName);
                return;
            }

            bot.user.setActivity(game, { type: ActivityType[type] });
            log.info(`[${botName}] Set activity to ${activity.name} ${activity.type}`);

        } catch (error) {
            log.error(`[${botName}] Failed to login: ${error}`);
            // Remove bot from botArray to avoid further errors
            botArray.splice(botArray.indexOf(botObj), 1);
            pm2Metrics.errors.inc();
            await errorAlert('logging in', '000', error, botName);
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
    setInterval(checkGamebananaFeed, 3 * 60 * 1000);
})();

module.exports = {
    botArray,
    mikuBot,
    errorAlert,
}


