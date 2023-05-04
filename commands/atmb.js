const {slashCommandBuilder, PermissionFlagsBits } = require('@discordjs/builders');

module.exports = {
    data: slashCommandBuilder()
        .setName('atmb')
        .setDescription('Act as miku bot')
        .setDefaultPermission(0)
        .addChannelOption(option => option.setName('channel').setDescription('Channel to send message to').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        if (!channel.isText()) {
            return interaction.reply({ content: `Error: Channel must be a text channel.`, ephemeral: true });
        }
        await channel.send(message);
        await interaction.reply({ content: `Message sent.`, ephemeral: true });
    }

}