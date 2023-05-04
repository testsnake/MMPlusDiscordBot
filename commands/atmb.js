const {SlashCommandBuilder, PermissionFlagsBits } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('atmb')
        .setDescription('Act as miku bot')
        .setDefaultPermission(false)
        .addChannelOption(option => option.setName('channel').setDescription('Channel to send message to').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        if (!channel.isTextBased()) {
            return interaction.reply({ content: `Error: Channel must be a text channel.`, ephemeral: true });
        }
        await channel.sendTyping();
        await interaction.reply({ content: `Message sending.`, ephemeral: true });
        await new Promise(resolve => setTimeout(resolve, 4000));
        await channel.send(message);
        await interaction.editReply({ content: `Message sent.`, ephemeral: true });
    }

}