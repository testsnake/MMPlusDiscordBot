const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('booster')
        .setDescription('Manages your booster role.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('changecolorhex')
                .setDescription('Changes the color of your booster role with hex')
                .addStringOption(option =>
                    option.setName('color')
                    .setDescription('The color to change to. Format #RRGGBB.')
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('changecolor')
                .setDescription('Changes the color of your booster role.')
                .addStringOption(option =>
                    option.setName('color')
                    .setDescription('The color to change to.')
                    .setRequired(true)
                    .addChoices(
                        {name: 'Red', value: 'red'},
                        {name: 'Orange', value: 'orange'},
                        {name: 'Yellow', value: 'yellow'},
                        {name: 'Green', value: 'green'},
                        {name: 'Blue', value: 'blue'},
                        {name: 'Purple', value: 'purple'},
                        {name: 'Pink', value: 'pink'},
                        {name: 'Black', value: 'black'},
                        {name: 'White', value: 'white'},
                        {name: 'Grey', value: 'grey'},
                        {name: 'Brown', value: 'brown'},
                        {name: 'Cyan', value: 'cyan'},
                        {name: 'Lime', value: 'lime'},
                        {name: 'Magenta', value: 'magenta'},
                        {name: 'Teal', value: 'teal'},
                        {name: 'Silver', value: 'silver'},
                        {name: 'Navy', value: 'navy'},
                        {name: 'Miku Blue', value: 'mikublue'},
                        {name: 'Rin Yellow', value: 'rinyellow'},
                        {name: 'Len Orange', value: 'lenorange'},
                        {name: 'Luka Pink', value: 'lukapink'},
                        {name: 'Katio Blue', value: 'Kaito Blue'},
                        {name: 'Meiko Red', value: 'meikored'},
                        {name: 'Neru Yellow', value: 'neruyellow'},
                        {name: 'Haku Grey', value: 'hakugrey'},
                        {name: 'Teto Red', value: 'tetored'},
                        {name: 'Gumi Green', value: 'gumigreen'}
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('changename')
                .setDescription('Changes the name of your booster role.')
                .addStringOption(option =>
                    option.setName('name')
                    .setDescription('The name to change to.')
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('changeicon')
                .setDescription('Changes the icon of your booster role.')
                .addStringOption(option =>
                    option.setName('icon')
                    .setDescription('The icon to change to.')
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Shows help message.')
        ),
    


}