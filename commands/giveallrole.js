const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveallrole')
        .setDescription('Gives every single user a specified role.')
        .setNameLocalizations({
            fr: 'rôleàtous',
            nl: 'geefallemaalrol',
            'pt-BR': 'darolaaotodos',
            'zh-CN': '给所有人添加角色',
            ja: '全員にロールを付与',
            'zh-TW': '給所有人添加角色',
            ko: '모든사용자에게역할부여',

            })
        .setDescriptionLocalizations({
            de: 'Gibt jedem Benutzer eine bestimmte Rolle.',
            'en-GB': 'Gives every single user a specified role.',
            'en-US': 'Gives every single user a specified role.',
            'es-ES': 'Da a cada usuario un rol específico.',
            fr: 'Donne à chaque utilisateur un rôle spécifié.',
            nl: 'Geeft elke gebruiker een bepaalde rol.',
            'pt-BR': 'Dá a cada usuário uma função específica.',
            'zh-CN': '给每个用户指定的角色。',
            ja: 'すべてのユーザーに指定された役割を与えます。',
            'zh-TW': '給每個用戶指定的角色。',
            ko: '모든 사용자에게 지정된 역할을 부여합니다.',
        })
        .addRoleOption(option => option.setName('role').setDescription('The role you want to give to every user.')),
    async execute(interaction) {
        const targetRole = interaction.options.getRole('role');
        const guild = interaction.guild;

        // Check if the command user has administrator permissions.
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.\nOnly users with the "Administrator" permission can give roles to all users.', ephemeral: true });
        }

        try {
            // Fetch all guild members
            await guild.members.fetch();

            // Iterate over each member and add the role
            guild.members.cache.each(async member => {
                if (!member.roles.cache.has(targetRole.id) && !member.user.bot) {
                    await member.roles.add(targetRole);
                }
            });

            return await interaction.reply(`The role ${targetRole} has been given to all users.`);
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: 'There was an error giving the role to all users. Please try again.', ephemeral: true });
        }
    },
};
