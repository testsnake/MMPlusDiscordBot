const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs");
const mikuBotVer = fs.readFileSync('./versionID.txt', 'utf8');
const pm2Metrics = require('../../utils/pm2metrics.js');
const { config } = require('../../config.json');
const log = require('../../utils/logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setNameLocalizations({
            'zh-CN': '头像',
            ja: 'アバター',
            'zh-TW': '頭像',
            ko: '아바타',

        })
        .setDescription('Get the avatar of a user.')
        .setDescriptionLocalizations({
            de: 'Holen Sie sich den Avatar eines Benutzers.',
            'en-GB': 'Get the avatar of a user.',
            'en-US': 'Get the avatar of a user.',
            'es-ES': 'Obtén el avatar de un usuario.',
            fr: 'Obtenez l\'avatar d\'un utilisateur.',
            nl: 'Haal de avatar van een gebruiker op.',
            'pt-BR': 'Obtenha o avatar de um usuário.',
            'zh-CN': '获取用户的头像。',
            ja: 'ユーザーのアバターを取得します。',
            'zh-TW': '取得用戶的頭像。',
            ko: '사용자의 아바타를 가져옵니다.',
        })
        .addUserOption(option =>
            option
                .setName('user')
                .setNameLocalizations({
                    de: 'benutzer',
                    'en-GB': 'user',
                    'en-US': 'user',
                    'es-ES': 'usuario',
                    fr: 'utilisateur',
                    nl: 'gebruiker',
                    'pt-BR': 'usuário',
                    'zh-CN': '用户',
                    ja: 'ユーザー',
                    'zh-TW': '用戶',
                    ko: '사용자',
                })
                .setDescription('The user to get the avatar of.')
                .setDescriptionLocalizations({
                    de: 'Der Benutzer, von dem der Avatar geholt werden soll.',
                    'en-GB': 'The user to get the avatar of.',
                    'en-US': 'The user to get the avatar of.',
                    'es-ES': 'El usuario del que obtener el avatar.',
                    fr: 'L\'utilisateur dont il faut obtenir l\'avatar.',
                    nl: 'De gebruiker van wie de avatar moet worden opgehaald.',
                    'pt-BR': 'O usuário para obter o avatar.',
                    'zh-CN': '要获取头像的用户。',
                    ja: 'アバターを取得するユーザー。',
                    'zh-TW': '要獲取頭像的用戶。',
                    ko: '아바타를 가져올 사용자.',
                })
                .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const avatarEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setFooter({ text: `${mikuBotVer}`});
    pm2Metrics.actionsPerformed.inc();
    await interaction.reply({ embeds: [avatarEmbed] });
  },
};
