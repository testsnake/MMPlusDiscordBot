const {SlashCommandBuilder} = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');
const log = require('../../logger.js');

function rearrangeAndConvert(hex) {
    // Removes a leading # if it exists
    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }

    // Removes 0x if it exists
    if (hex.startsWith('0x')) {
        hex = hex.substring(2);
    }

    // Sets Alpha to FF if it doesn't exist
    if (hex.length === 6) {
        hex += 'FF'
    }

    // Ensure the input is 8 characters long (32 bits)
    if (hex.length !== 8) {
        throw new Error("Invalid hex color input");
    }

    // Rearrange from RRGGBBAA into AABBGGRR
    let rearranged = hex.substring(6, 8) + hex.substring(4, 6) + hex.substring(0, 2) + hex.substring(2, 4);

    // Convert to unsigned decimal
    let decimal = parseInt(rearranged, 16);

    return decimal;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyriccolour')
        .setDescription('Converts RRGGBBAA to decimal for use in Script Editor')
        .setNameLocalizations({
            'en-GB': 'lyriccolour',
            'en-US': 'lyriccolor',
        })
        .addStringOption(option =>
            option.setName('hex')
                .setDescription('The hex colour to convert')
                .setDescriptionLocalizations({
                    'en-GB': 'The hex colour to convert',
                    'en-US': 'The hex color to convert',
                })
                .setRequired(true)),
    async execute(interaction) {
        try {
            const hex = interaction.options.getString('hex');
            const decimal = rearrangeAndConvert(hex);
            await interaction.reply({ content: `\`\`\`${decimal.toString()}\`\`\``, ephemeral: true });
            pm2Metrics.actionsPerformed.inc();
        } catch (error) {
            log.error(error);
            const locales = {
                'en-GB': 'Enter a valid Hex Colour\nFormat RRGGBBAA',
                'en-US': 'Enter a valid Hex Color\nFormat RRGGBBAA',
            }
            await interaction.reply({content: locales[interaction.locale] ?? 'Enter a valid Hex Colour\nFormat RRGGBBAA', ephemeral: true});
            pm2Metrics.errors.inc();
        }
    }
}