const { SlashCommandBuilder } = require('discord.js');
const Uwuifier = require('uwuifier').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('vote for the current event')
        .addStringOption(option =>
            option.setName('chart')
                .setDescription('the chart you want to vote on')
                .setRequired(true)),
    async execute(interaction) {


        await interaction.reply("Voting hasn't started yet!");
    },
};
