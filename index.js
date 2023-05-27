const fs = require('fs');
const path = require('path');

const { Client, Collect, Events, GatewayIntents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, GatewayIntentBits,
    ActivityType
} = require('discord.js');
const { botArray } = require('./utils/bots.js');
const { REST, Routes } = require('discord.js');
const tokens = require('./tokens.json');
const config = require('./config.json');
const utils = require('./utils/utils.js');
const { errorAlert, rxt, ts } = utils;
const log = require('./utils/logger.js');
const pm2Metrics = require('./utils/pm2metrics.js');
const { checkGamebananaFeed } = require('./utils/gamebanana.js');

const {sendEmbed, getString} = require("./utils/utils");


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
    await loadCommandsAndEvents();
    log.info('Commands and events loaded');

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

    });
}


(async () => {
    await startSystem();
    setInterval(checkGamebananaFeed, 3 * 60 * 1000);
})();




