const log = require('../../utils/logger.js');

// module that logs each message received
const {addLog} = require("../../utils/logManager");
const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            if (message.author.bot) return;
            log.info(`[${message.author.username}]: ${message.content}`);

            if (message.channel.id === '1087921223251542088') {
                let hasMedia = false;

                // Check if the message has any attachments
                if (message.attachments.size > 0) {
                    hasMedia = true;
                }

                // Check if the message has any embeds with media
                message.embeds.forEach((embed) => {
                    if (embed.type === 'image' || embed.type === 'video' || embed.type === 'gifv') {
                        hasMedia = true;
                    }
                });

                // Check if the message has any links to media files
                const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.avi', '.mov', '.wmv'];
                const messageContent = message.content.toLowerCase();
                for (const extension of mediaExtensions) {
                    if (messageContent.includes(extension)) {
                        hasMedia = true;
                        break;
                    }
                }

                // Check if the message has a Tenor GIF link
                if (message.content.includes('tenor.com/view/')) {
                    hasMedia = true;
                }


                if (hasMedia) {
                    log.info(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);
                    addLog(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);

                    // Add the role to the user
                    const roleToAdd = message.guild.roles.cache.get('1087921322832699412');
                    if (roleToAdd) {
                        message.member.roles.add(roleToAdd)
                            .then(() => log.info(`Added role ${roleToAdd.name} to ${message.author.username}.`))
                            .catch(log.error);
                    } else {
                        log.error('Role not found.');
                    }
                } else {
                    log.info(`${message.author.username} sent a message without media in channel ${message.channel.name}.`);
                    addLog(`${message.author.username} sent a message without media in channel ${message.channel.name}.`);

                    const deniedEmbed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Message Denied')
                        .setDescription('You did not read the rules. Please read the rules and try again.' +
                            '\nIf you believe this is a mistake, please contact a staff member.\n\n' +
                            'あなたはルールを読んでいません。ルールを読み、再試行してください。\n' +
                            'これが誤りだと思われる場合は、スタッフに連絡してください。\n\n' +
                            'No has leído las reglas. Por favor, lee las reglas e inténtalo de nuevo.\n' +
                            'Si crees que esto es un error, por favor contacta a un miembro del personal.\n\n' +
                            'Ви не прочитали правила. Будь ласка, прочитайте правила та спробуйте знову.\n' +
                            'Якщо ви вважаєте, що це помилка, будь ласка, зверніться до члена персоналу.\n\n' +
                            '你没有阅读规则。请阅读规则后再试一次。\n' +
                            '如果你认为这是一个错误，请联系工作人员。\n\n' +
                            '你沒有閱讀規則。請閱讀規則後再試一次。\n' +
                            '如果你認為這是一個錯誤，請聯繫工作人員。\n\n' +
                            'Você não leu as regras. Por favor, leia as regras e tente novamente.\n' +
                            'Se acredita que isto é um erro, por favor contacte um membro da equipa.'

                        )
                        .setTimestamp()

                    await message.author.send({embeds: [deniedEmbed]})
                }
            }


            // if (rxt(message, /\bass\b/i)) {
            // 	nPR(message, 'https://cdn.discordapp.com/attachments/421865513820618752/1071615776127201424/169F55F1-C038-41DD-9264-BD3D9E8C6D60.gif');
            // }

        } catch(err) {
            log.info("---- ERROR MESSAGE EVENT ----");
            log.error(err);
            log.info("---- ERROR MESSAGE EVENT ----");
        }
    }
}