const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const pm2Metrics = require('../../pm2metrics.js');
const config = require('../../config.json');
const log = require('../../logger.js');
const {sendEmbed} = require("../../utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes the last X messages in the channel.')
      .setDescriptionLocalizations({
        de: 'Löscht die letzten X Nachrichten im Kanal.',
        'en-GB': 'Deletes the last X messages in the channel.',
        'en-US': 'Deletes the last X messages in the channel.',
        'es-ES': 'Elimina los últimos X mensajes del canal.',
        fr: 'Supprime les X derniers messages du canal.',
        nl: 'Verwijdert de laatste X berichten in het kanaal.',
        'pt-BR': 'Exclui as últimas X mensagens no canal.',
        'zh-CN': '删除频道中的最后 X 条消息。',
        ja: 'チャンネルの最後の X メッセージを削除します。',
        'zh-TW': '刪除頻道中的最後 X 條消息。',
        ko: '채널에서 마지막 X 개의 메시지를 삭제합니다.',
      })
    .addIntegerOption(option => option.setName('count').setDescription('The number of messages to delete (max 100).').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_MESSAGES),
  async execute(interaction) {
    try {
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
          pm2Metrics.actionsPerformed.inc();

        // Send an embed message to the logging channel indicating the number of messages deleted.


          const loggingEmbed = {
            ...purgeEmbed,
            description: `Deleted ${count} messages in ${channel.toString()}.`,
          };
          await sendEmbed(undefined, loggingEmbed)

      } catch (error) {
          log.error(error);
        await interaction.reply({ content: 'There was an error purging messages. Please try again. C-01', ephemeral: true });
        pm2Metrics.errors.inc();
        return await interaction.followUp({ content: `${error}`, ephemeral: true })
      }
    } catch (error) {
        log.error(error);
        await interaction.reply({ content: 'There was an error purging messages. Please try again. C-02', ephemeral: true });
        return await interaction.followUp({ content: `${error}`, ephemeral: true })
    }
  },
};
