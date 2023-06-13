
const { sendStarboardEmbed } = require('../../utils.js');
const config = require('../../config.json');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, message, client) {
        if (message.channel.id === config.starboardChannelID) return;

        if (reaction.emoji.name === '⭐' && reaction.count === 4) {
            await sendStarboardEmbed(reaction.message.id, reaction.message.channel);
        }
    }
}