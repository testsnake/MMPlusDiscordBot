const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes the last X messages in the channel.')
    .addIntegerOption(option => option.setName('count').setDescription('The number of messages to delete (max 100).').setRequired(true)),
  async execute(interaction) {
    // Check if the command user has permission to manage messages in the channel.
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const count = interaction.options.getInteger('count');

    if (count <= 0 || count > 100) {
      return await interaction.reply({ content: 'Invalid message count. Please enter a number between 1 and 100.', ephemeral: true });
    }

    const channel = interaction.channel;

    try {
      const messages = await channel.messages.fetch({ limit: count  }); // Fetch the messages to be deleted.
      await channel.bulkDelete(messages); // Delete the messages.

      const purgeEmbed = {
        color: 0x00ff00,
        title: 'Purged Messages',
        description: `Deleted ${count} messages.`,
        timestamp: new Date(),
      };

      // Send an embed message to the current channel indicating the number of messages deleted.
      const replyMessage = await interaction.reply({ embeds: [purgeEmbed], fetchReply: true });
      setTimeout(() => {
        replyMessage.delete().catch(console.error);
      }, 5000); // Delete the reply message after 5 seconds.

      // Send an embed message to the logging channel indicating the number of messages deleted.
      const loggingChannel = interaction.client.channels.cache.get('1008978799989362808');
      if (loggingChannel) {
        const loggingEmbed = {
          ...purgeEmbed,
          description: `Deleted ${count} messages in ${channel.toString()}.`,
        };
        await loggingChannel.send({ embeds: [loggingEmbed] });
      }
    } catch (error) {
      console.error(error);
      return await interaction.reply({ content: 'There was an error purging messages. Please try again.', ephemeral: true });
    }
  },
};
