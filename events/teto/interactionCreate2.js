const utils = require('../../utils.js');
const log = require('../../logger.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        log.info(`[INTERACTION] ${interaction.user.tag} clicked button ${interaction.customId} in ${interaction.channel.name} in ${interaction.guild.name}`);



        const button = utils.getButton(interaction.customId);

        if (!button) {
            log.error(`No button matching ${interaction.customId} was found.`);
            return;
        }
        const buttonId = utils.getButton(interaction.customId);

        if (!buttonId) {
            log.error(`No buttonId matching ${interaction.customId} was found.`);
        } else {
            log.debug(buttonId);
            utils.runButton(interaction.customId, interaction);
        }


    }
}