const { SlashCommandBuilder, discord } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Gives you a role')
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The role you want to give yourself')
                .setRequired(true)
                .addChoices(
                    { name: 'Event Ping', value: '1102399054656315523' },
                    { name: 'Modder', value: "1102667046854078525"},
                    { name: 'Charter', value: "1102667128336822392"},
                    { name: 'Modeler', value: "1102667173022937159"},
                    { name: 'Programmer', value: "1102667447611424778"}
                ),
        ),
    async execute(interaction) {
        try {
            const role = interaction.options.getString('role');
            const newRole = await interaction.guild.roles.cache.get(role);

            if (interaction.member.roles.cache.has(role)) {
                await interaction.member.roles.remove(newRole);
                await interaction.reply({
                    content: `Removed ${newRole.name} `,
                    allowedMentions: {repliedUser: false},
                    ephemeral: true
                });
            } else {
                await interaction.member.roles.add(newRole);
                await interaction.reply({
                    content: `Added ${newRole.name} `,
                    allowedMentions: {repliedUser: false},
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command! Please message testsnake with the following error: ' + error,
                ephemeral: true
            });
        }


    }


}