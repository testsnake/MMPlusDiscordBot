const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveallrole')
        .setDescription('Gives every single user a specified role.')
        .addRoleOption(option => option.setName('role').setDescription('The role you want to give to every user.')),
    async execute(interaction) {
        const targetRole = interaction.options.getRole('role');
        const guild = interaction.guild;

        // Check if the command user has administrator permissions.
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.\nOnly users with the "Administrator" permission can give roles to all users.', ephemeral: true });
        }

        try {
            // Fetch all guild members
            await guild.members.fetch();

            // Iterate over each member and add the role
            guild.members.cache.each(async member => {
                if (!member.roles.cache.has(targetRole.id) && !member.user.bot) {
                    await member.roles.add(targetRole);
                }
            });

            return await interaction.reply(`The role ${targetRole} has been given to all users.`);
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error giving the role to all users. Please try again.', ephemeral: true });
        }
    },
};
