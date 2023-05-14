const {addLog} = require("../../logManager");
const log = require('../../logger.js');


module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        try {
            if (message.author.bot) return;
            console.log(`[${message.author.username}]: ${message.content}`);

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
                    console.log(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);
                    addLog(`${message.author.username} sent a message with media in channel ${message.channel.name}.`);

                    // Add the role to the user
                    const roleToAdd = message.guild.roles.cache.get('1087921322832699412');
                    if (roleToAdd) {
                        message.member.roles.add(roleToAdd)
                            .then(() => console.log(`Added role ${roleToAdd.name} to ${message.author.username}.`))
                            .catch(console.error);
                    } else {
                        console.error('Role not found.');
                    }
                }
            }


            // if (rxt(message, /\bass\b/i)) {
            // 	nPR(message, 'https://cdn.discordapp.com/attachments/421865513820618752/1071615776127201424/169F55F1-C038-41DD-9264-BD3D9E8C6D60.gif');
            // }

        } catch (error) {
            log.error(error);
        }
    },
}