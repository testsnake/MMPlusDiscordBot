const { SlashCommandBuilder } = require('discord.js');
const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-modify')
        .setDescription('Modify a ticket channel.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action to perform')
                .setRequired(true)
                .addChoices(
                    {name: 'add', value: 'add'},
                    {name: 'remove', value: 'remove'},
                    {name: 'delete', value: 'delete'}
                )
        )
        .addUserOption(option => option.setName('user').setDescription('The user to modify')),
    async execute(interaction) {
        const categoryName = 'TICKETS';
        const category = await interaction.guild.channels.fetch(`1087907145246322779`);
        if (!category) {
            return interaction.reply({ content: `Error: Category does not exist. Please contact an administrator.`, ephemeral: true });
        }
        if (!interaction.channel.parent || interaction.channel.parentId !== category.id) {
            return interaction.reply({ content: `Error: This command can only be used in a ticket channel.`, ephemeral: true });
        }

        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');

        if (action === 'add') {
            await interaction.channel.permissionOverwrites.create(user.id, {
                ViewChannel: true
            });
            await interaction.reply({ content: `${user.username} can now access this ticket channel.`});
        } else if (action === 'remove') {
            await interaction.channel.permissionOverwrites.delete(user.id);
            await interaction.reply({ content: `${user.username} can no longer access this ticket channel.`});
        } else if (action === 'delete') {
            await interaction.channel.delete();
            await interaction.reply({ content: `This ticket channel has been deleted.`, ephemeral: true });
        } else {
            await interaction.reply({ content: `Error: Invalid action.`, ephemeral: true });
        }
    },
};
