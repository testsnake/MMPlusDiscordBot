const { SlashCommandBuilder } = require('discord.js');

async function grabSpecialRole(member, lowerBoundId, upperBoundId) {
    const lowerBoundRole = await member.guild.roles.cache.get(lowerBoundId);
    const upperBoundRole = await member.guild.roles.cache.get(upperBoundId);

    if (!lowerBoundRole || !upperBoundRole) return null;

    const eligibleRoles = await member.roles.cache.filter(role => {
        const lowerComparison = role.comparePositionTo(lowerBoundRole);
        const upperComparison = role.comparePositionTo(upperBoundRole);
        return lowerComparison > 0 && upperComparison < 0;
    });

    if (eligibleRoles.size > 0) {
        // Find the role with the highest position
        return eligibleRoles.reduce((highestRole, currentRole) => {
            return currentRole.comparePositionTo(highestRole) > 0 ? currentRole : highestRole;
        });
    } else {
        return null;
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('booster')
        .setDescription('Manages your booster role.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolorhex')
                .setDescription('Changes the color of your booster role with hex')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color to change to. Format #RRGGBB.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolor')
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
                            {name: 'Miku Blue', value: 'mikublue'},
                            {name: 'Rin Orange', value: 'rinyellow'},
                            {name: 'Len Yellow', value: 'lenorange'},
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
                .setName('setname')
                .setDescription('Changes the name of your booster role.')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name to change to.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('seticon')
                .setDescription('Changes the icon of your booster role.')
                .addStringOption(option =>
                    option.setName('icon')
                        .setDescription('Icon URL')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Shows help message.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Creates a custom booster role.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deletes your booster role.')
        ),
    async execute(interaction) {
        try {
            if (!interaction.member.roles.cache.has('1092636310142980127') && !interaction.member.roles.cache.has('1093385832540405770')) {
                return await interaction.reply({content: 'You do not have a booster role.', ephemeral: true});
            } else {
                const subcommand = interaction.options.getSubcommand();
                const specialRole = await grabSpecialRole(interaction.member, '1093246448566550579', '1093246368077840424');
                if (!specialRole) {
                    if (subcommand === 'help') {
                        return await interaction.reply({
                            content: 'This feature is still in its early stages. Message testsnake if you have any issues',
                            ephemeral: true
                        });
                    } else if (subcommand === 'create') {
                        const boosterRolePosition = await interaction.guild.roles.cache.get('1093246368077840424').position;
                        const boosterRolePos = boosterRolePosition - 1;
                        const boosterRole = await interaction.guild.roles.create({

                                name: "Unnamed Role",
                                hoist: false,
                                mentionable: false,
                                permissions: 0,
                                position: boosterRolePos,
                                reason: 'Booster role creation'
                            
                        });


                        await interaction.member.roles.add(boosterRole);

                        return await interaction.reply({content: 'Created a booster role.', ephemeral: true});
                    }

                    return await interaction.reply({
                        content: 'You do not have a booster role. You can use /booster create to create a booster role.\nContact <@201460040564080651> for more information.',
                        ephemeral: true
                    });
                } else {
                    if (subcommand === 'setcolorhex') {
                        const color = interaction.options.getString('color');
                        if (color.startsWith('#')) {
                            await specialRole.setColor(color);
                            return await interaction.reply({content: 'Changed color to ' + color, ephemeral: true});
                        } else {
                            return await interaction.reply({
                                content: 'Invalid color. Please use the format #RRGGBB.',
                                ephemeral: true
                            });
                        }
                    } else if (subcommand === 'setcolor') {
                        const colorMap = {
                            red: '#FF0000',
                            orange: '#FFA500',
                            yellow: '#FFFF00',
                            green: '#008000',
                            blue: '#0000FF',
                            purple: '#800080',
                            pink: '#FFC0CB',
                            black: '#000000',
                            white: '#FFFFFF',
                            grey: '#808080',
                            brown: '#A52A2A',
                            cyan: '#00FFFF',
                            lime: '#00FF00',
                            magenta: '#FF00FF',
                            teal: '#008080',
                            mikublue: '#33ccba',
                            kagamineorange: '#ffcc11',
                            kagamineyellow: '#ffee12',
                            lukapink: '#ffbacc',
                            kaitoblue: '#3367cd',
                            meikored: '#de4444',
                            neruyellow: '#face1e',
                            hakugrey: '#a3a3a3',
                            tetored: '#d54458',
                            gumigreen: '#9fe390'
                        };
                        const color = interaction.options.getString('color');
                        const hexColor = colorMap[color];

                        if (!hexColor) {
                            return await interaction.reply({content: 'Invalid color.', ephemeral: true});
                        }

                        await specialRole.setColor(hexColor);
                        return await interaction.reply({content: `Changed color to ${color} (${hexColor})`, ephemeral: true});
                    } else if (subcommand === 'setname') {
                        const name = interaction.options.getString('name');
                        await specialRole.setName(name);
                        return await interaction.reply({content: 'Changed name to ' + name, ephemeral: true});
                    } else if (subcommand === 'seticon') {
                        try {
                            const icon = interaction.options.getString('icon');
                            await specialRole.setIcon(icon);
                            return await interaction.reply({content: 'Changed icon to ' + icon, ephemeral: true});
                        } catch (error) {
                            return await interaction.reply({
                                content: 'Invalid icon. Make sure it is a valid URL.',
                                ephemeral: true
                            });
                        }
                    } else if (subcommand === 'help') {
                        return await interaction.reply({
                            content: 'This feature is still in its early stages. Message testsnake if you have any issues',
                            ephemeral: true
                        });
                    } else if (subcommand === 'create') {
                        await interaction.reply({content: 'You already have a custom booster role', ephemeral: true});
                    } else if (subcommand === 'delete') {
                        await specialRole.delete();
                        return await interaction.reply({content: 'Deleted your custom booster role', ephemeral: true});
                    }
                }
            }

        } catch (error) {
            console.log(error);
            return await interaction.reply({content: 'An error occurred. Please try again later.', ephemeral: true});
        }
    }
}