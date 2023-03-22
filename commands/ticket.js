const { SlashCommandBuilder } = require('discord.js');
const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Open a ticket.'),
    async execute(interaction) {
        const categoryName = 'TICKETS';
        const channelName = `ticket-${Math.floor(Math.random() * 10000)}`;
        const category = await interaction.guild.channels.fetch(`1087907145246322779`);
        if (!category) {
            return interaction.reply({ content: `Error: Category does not exist. Please contact an administrator.`, ephemeral: true });
        }
        const channel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            topic: `Ticket for ${interaction.user.username}`,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: '1087906708040466514',
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                }
            ],
        });

        await interaction.reply({ content: `Your ticket channel has been created: <#${channel.id}>`, ephemeral: true });
    },
};