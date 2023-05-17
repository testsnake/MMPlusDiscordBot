const log = require('../logger.js');
const config = require('../config.json');
const { botVer, botAvatarURL } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const { botArray } = require('../bots.js');
const {getString, sendEmbed} = require("../utils");

// sends ready message on Event 'ready'
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        log.info(`[READY] ${client.user.tag} is ready!`);
        // get Clients data in botArray by matching IDs
        let bot;
        try {
            bot = await botArray.find(bot => bot.clientID === client.user.id);
        } catch (err) {
            log.error(`Error in ready event for ${client.user.tag}:\n${err}`);
            return
        }
        log.debug(bot)
        const loginString = await getString(bot.name, 'botStarted');
        const embed = new EmbedBuilder()
            .setColor(bot.color)
            .setAuthor({
                name: `${client.user.tag}`,
                iconURL: `${client.user.avatarURL()}`
            })
            .setDescription(`**${loginString}**`)
            .setTimestamp(new Date())
            .setFooter({text: `${config.botVer}`, iconURL: `${config.botAvatarURL}`});
        await sendEmbed(bot.bot, embed);
    }
}