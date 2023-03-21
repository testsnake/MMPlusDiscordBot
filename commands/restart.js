const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts MikuBot'),
  async execute(interaction) {
    if (interaction.member.permissions.has('ADMINISTRATOR')) {
      exec('sudo bash /home/testsnake/github/discordbottest/reboot.sh', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          const loggingChannelId = '1008978799989362808';
          client.channels.fetch(loggingChannelId).send('MikuBot has had an error\n```' + err + '```');
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
      await interaction.reply('Restarting MikuBot...');
    } else {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
    }
  },
};
