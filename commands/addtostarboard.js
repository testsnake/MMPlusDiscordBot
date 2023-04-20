const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

function ts(str, maxLength) {
    return truncateString(str, maxLength);
}
async function addMessageToStarboard(message, starboardChannelId) {
    try {
        const starboardChannel = await message.client.channels.fetch(starboardChannelId);

        const starboardEmbed = new EmbedBuilder()
            .setAuthor({name: 'Starred Message', iconURL: message.author.avatarURL({dynamic: true})})
            .setDescription(`${ts(message.content, 4095)}`)
            .addFields(
                {name: 'Author', value: `${message.author.toString()}`, inline: true},
                {name: 'Channel', value: `<#${message.channel.id}>`, inline: true}
            )
            .setColor(0xd9c65b)
            .setTimestamp(message.createdAt);

        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            if (attachment.contentType.startsWith('image/')) {
                starboardEmbed.setImage(attachment.url);
            }
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Link to original message')
                    .setStyle('Link')
                    .setURL(message.url)
            );

        starboardChannel.send({embeds: [starboardEmbed], components: [row]});
    } catch (err) {
        console.error("Error adding message to starboard:", err);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtostarboard')
        .setDescription('Manually add a message to the starboard')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel where the message is located')
            .setRequired(true))
        .addStringOption(option => option
            .setName('message_id')
            .setDescription('The ID of the message to be added to the starboard')
            .setRequired(true)),

    async execute(interaction) {
        const channelId = interaction.options.getChannel('channel').id;
        const messageId = interaction.options.getString('message_id');
        const starboardChannelId = '1092643863820251196';

        const channel = await interaction.client.channels.fetch(channelId);
        const message = await channel.messages.fetch(messageId);
        await addMessageToStarboard(message, starboardChannelId);

        await interaction.reply({ content: 'Message successfully added to the starboard.', ephemeral: true });
    },
};
