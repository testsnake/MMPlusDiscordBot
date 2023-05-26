const config = require('./config.json');
const log = require('./logger.js');
let {botArray} = require("./bots.js");
const {EmbedBuilder} = require("discord.js");
let clientZero = botArray[0].bot;

async function  starboard(messageLink, channel = config.starboardChannelID, client = clientZero) {

}