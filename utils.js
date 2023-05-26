const config = require('./config.json');
const log = require('./logger.js');
let {botArray} = require("./bots.js");
const {EmbedBuilder} = require("discord.js");
let clientZero = botArray[0].bot;


/*
    * Test a regex against a string
    * @param {RegExp} reg - The regex to test
    * @param {string} str - The string to test against
    * @returns {boolean}
 */
function rxt(reg, str) {
    return reg.test(str);
}


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
            .setDescription(`${ts(error, 2047)}`)
            .setColor(0xFF0000)
            .setTimestamp();

        await sendEmbed(clientZero, errorEmbed);
        await sendMsg(undefined, "<@201460040564080651> help")
    } catch (error) {
        log.error(`[${botName}] Failed to send error alert: ${error}`);
    }

}

/*
    * Truncate a string
    * @param {string} str - The string to truncate
    * @param {number} maxLength - The maximum length of the string
    * @returns {string}
 */
function ts(input, maxLength) {
    let str;

    if (typeof input === 'string') {
        str = input;
    } else if (input instanceof Error) {
        str = input.message;
    } else {
        log.error('The input must be a string or an Error object.');
        return;
    }

    if (str.length <= maxLength) {
        return str;
    }

    return str.slice(0, maxLength);
}



let globalVars = {}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/*
    * Send a message to a channel
    * @param {Client} client - The Discord client
    * @param {string} content - The content of the message
    * @param {string} channel - The channel ID to send the message to
    * @param {Object} options - Options to pass to the send method
    * @returns {Promise<Message>}
 */
async function sendMsg(client = clientZero, content, channel = config.loggingChannelID, options = {}) {
    log.info(`Sending message to channel ${channel}`);
    const channelObj = await client.channels.cache.get(channel);
    return await channelObj.send(content, options);
}

/*
    * Send a message to a user
    * @param {Client} client - The Discord client
    * @param {string} content - The content of the message
    * @param {string} user - The user ID to send the message to
    * @param {Object} options - Options to pass to the send method
    * @returns {Promise<Message>}
 */
async function sendMsgToUser(client = clientZero, content, user, options = {}) {
    log.info(`Sending message to user ${user}`);
    const userObj = await client.users.fetch(user);
    return await userObj.send(content, options);
}

/*
    * Send an embed to a channel
    * @param {Client} client - The Discord client
    * @param {MessageEmbed} embed - The embed to send
    * @param {string} channel - The channel ID to send the embed to
    * @param {Object} options - Options to pass to the send method
    * @returns {Promise<Message>}
 */
async function sendEmbed(client = clientZero, embed, channel = config.loggingChannelID, options = {}) {
    log.info(`Sending embed to channel ${channel}`);

    const channelObj = await client.channels.cache.get(`${channel}`);
    log.debug(`Channel object: ${channelObj}`)
    return channelObj.send({embeds: [embed], ...options});
}

async function sendAutoPublishEmbed(client = clientZero, embed, channel = config.loggingChannelID, options = {}) {
    log.info(`Sending embed to channel ${channel}`);

    const channelObj = await client.channels.cache.get(`${channel}`);
    return channelObj.send({embeds: [embed], ...options}).then( async (msg) => {
        await msg.crosspost().then(() => {
            log.info(`Successfully auto-published embed to channel ${channel}`);
            return msg;
        }).catch((err) => {
          log.error(`Error auto-publishing embed to channel ${channel}:\n${err.toString()}`)
            return err;
        })
    });
}

/*
    * Get a string from a JSON file
    * @param {string} botName - The name of the bot
    * @param {string} stringName - The name of the string to get
 */
async function getString(botName, stringName) {
    log.info(`Getting string ${stringName} from ${botName}`)
    const strings = await require(`./text/strings/${botName}.json`);
    return strings[stringName];
}



module.exports = {
    rxt,
    ts,
    globalVars,
    delay,
    sendMsg,
    sendMsgToUser,
    sendEmbed,
    getString,
    sendAutoPublishEmbed,
    errorAlert

}