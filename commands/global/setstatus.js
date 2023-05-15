const { SlashCommandBuilder } = require('discord.js');
const { Client, Intents, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Sets the bot\'s status')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The new status for the bot')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of the status (PLAYING, WATCHING, LISTENING, STREAMING, COMPETING)')
                .setRequired(true)
                .addChoices(
                    {name: 'Playing', value: 'Playing'},
                    {name: 'Watching', value: 'Watching'},
                    {name: 'Listening', value: 'Listening'},
                    {name: 'Streaming', value: 'Streaming'},
                    {name: 'Competing', value: 'Competing'}
                )),
    async execute(interaction) {
        // Check if the user has the Administrator permission
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
        }

        const status = interaction.options.getString('status');
        const type = interaction.options.getString('type').toLowerCase();
        const activityType = type.charAt(0).toUpperCase() + type.slice(1);
        const validActivityTypes = Object.keys(ActivityType).filter(key => isNaN(parseInt(key)));
        console.log(ActivityType)
        console.log(validActivityTypes)
        console.log(activityType)
        if (!validActivityTypes.includes(activityType)) {
            return await interaction.reply({ content: `${activityType} Invalid activity type.`, ephemeral: true });
        }

        await interaction.client.user.setActivity(`${status}`, { type: ActivityType[activityType] })
        await interaction.reply({ content: `Status updated to: ${type}`, ephemeral: true });
    },
};
