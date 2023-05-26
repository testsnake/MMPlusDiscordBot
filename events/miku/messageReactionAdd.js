
const { sendStarboardEmbed } = require('../../utils.js');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, message, client) {

        if (reaction.emoji.name === '⭐' && reaction.count === 4) {
            await sendStarboardEmbed(reaction.message.id, reaction.message.channel.id);
        }
    }
}