const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

function ts(str, maxLength) {
    if (maxLength < 0 || typeof maxLength !== 'number') {
        throw new Error('maxLength must be a non-negative number');
    }

    if (str.length <= maxLength) {
        return str;
    }

    return str.slice(0, maxLength);
}
async function addMessageToStarboard(message, starboardChannelId) {
    try {
        const starboardChannel = await message.client.channels.fetch(starboardChannelId);

       let starboardEmbed = new EmbedBuilder()
            .setAuthor({name: 'Starred Message', iconURL: message.author.avatarURL({dynamic: true})})

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

        if (message.content.length > 0) {
            starboardEmbed.setDescription(ts(message.content, 2048));
        }

        starboardChannel.send({embeds: [starboardEmbed], components: [row]});
    } catch (err) {
        console.error("Error adding message to starboard:", err);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtostarboard')
        .setDescription('Manually add a message to the starboard')
        .setDescriptionLocalizations({
            de: 'Fügen Sie eine Nachricht manuell zum Starboard hinzu',
            'en-GB': 'Manually add a message to the starboard',
            'en-US': 'Manually add a message to the starboard',
            'es-ES': 'Añade manualmente un mensaje al tablón de estrellas',
            fr: 'Ajoutez manuellement un message au tableau des étoiles',
            nl: 'Voeg handmatig een bericht toe aan de sterrenplank',
            'pt-BR': 'Adicione manualmente uma mensagem à prancha de estrelas',
            'zh-CN': '手动将消息添加到明星板',
            ja: 'メッセージを手動でスターボードに追加する',
            'zh-TW': '手動將訊息添加到明星板',
            ko: '메시지를 수동으로 스타보드에 추가합니다',
        })
        // Adds to star board
        .setNameLocalizations({
            de: 'zumstarboardhinzufügen',
            'en-GB': 'addtostarboard',
            'en-US': 'addtostarboard',
            'es-ES': 'añadiralatablóndeestrellas',
            fr: 'ajouteràlatabledesétoiles',
            nl: 'toevoegenaanhetsterrenbord',
            'pt-BR': 'adicionaraotabladeestrelas',
            'zh-CN': '添加到明星板',
            ja: 'スターボードに追加',
            'zh-TW': '添加到明星板',
            ko: '스타 보드에 추가',


        })
        .addChannelOption(option => option
            .setName('channel')
            .setNameLocalizations({
                de: 'kanal',
                'en-GB': 'channel',
                'en-US': 'channel',
                'es-ES': 'canal',
                fr: 'canal',
                nl: 'kanaal',
                'pt-BR': 'canal',
                'zh-CN': '频道',
                ja: 'チャンネル',
                'zh-TW': '頻道',
                ko: '채널',
            })
            .setDescription('The channel where the message is located')
            .setDescriptionLocalizations({
                de: 'Der Kanal, in dem sich die Nachricht befindet',
                'en-GB': 'The channel where the message is located',
                'en-US': 'The channel where the message is located',
                'es-ES': 'El canal donde se encuentra el mensaje',
                fr: 'Le canal où se trouve le message',
                nl: 'Het kanaal waar het bericht zich bevindt',
                'pt-BR': 'O canal onde a mensagem está localizada',
                'zh-CN': '消息所在的频道',
                ja: 'メッセージがあるチャンネル',
                'zh-TW': '訊息所在的頻道',
                ko: '메시지가 위치한 채널',
            })
            .setRequired(true))
        .addStringOption(option => option
            .setName('message_id')
            .setNameLocalizations({
                'es-ES': 'mensaje_id',
                nl: 'bericht_id',
                'pt-BR': 'mensagem_id',
                'zh-CN': '消息_id',
                ja: 'メッセージ_id',
                'zh-TW': '訊息_id',
                ko: '메시지_id',
            })
            .setDescription('The ID of the message to be added to the starboard')
            .setDescriptionLocalizations({
                de: 'Die ID der Nachricht, die zum Starboard hinzugefügt werden soll',
                'en-GB': 'The ID of the message to be added to the starboard',
                'en-US': 'The ID of the message to be added to the starboard',
                'es-ES': 'El ID del mensaje que se va a agregar al tablón de estrellas',
                fr: 'L\'identifiant du message à ajouter au tableau des étoiles',
                nl: 'De ID van het bericht dat aan de sterrenplank moet worden toegevoegd',
                'pt-BR': 'O ID da mensagem a ser adicionada à prancha de estrelas',
                'zh-CN': '要添加到明星板的消息 ID',
                ja: 'スターボードに追加するメッセージのID',
                'zh-TW': '要添加到明星板的訊息 ID',
                ko: '스타보드에 추가 할 메시지 ID',
            })
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
