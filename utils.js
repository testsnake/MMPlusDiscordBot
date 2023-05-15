const config = require('./config.json');
const log = require('./logger.js');

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
async function sendMsg(client, content, channel = config.loggingChannelID, options = {}) {
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
async function sendMsgToUser(client, content, user, options = {}) {
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
async function sendEmbed(client, embed, channel = config.loggingChannelID, options = {}) {
    log.info(`Sending embed to channel ${channel}`);
    const channelObj = await client.channels.cache.get(channel);
    return await channelObj.send({embeds: [embed], ...options});
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
    getString

}