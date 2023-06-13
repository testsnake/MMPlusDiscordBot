
const { sendStarboardEmbed } = require('../../utils.js');
const config = require('../../config.json');
const log = require('../../logger.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, message, client) {
        log.debug(`[REACTION] ${reaction.emoji.name} added to ${reaction.message.id} in ${reaction.message.channel.name} in ${reaction.message.guild.name}`)
        if (message.author.bot) return;

        if (reaction.emoji.name === '⭐' && reaction.count === 4) {
            await sendStarboardEmbed(reaction.message.id, reaction.message.channel);
        }
    }
}