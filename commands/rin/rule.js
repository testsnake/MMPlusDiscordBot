const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rule')
        .setDescription('Writes rule')
        .addIntegerOption(option => option.setName('rule').setDescription('rule number').setRequired(true))
        .addStringOption(option => option
            .setName('locale')
            .setDescription('locale')
            .setRequired(false)
            .addChoices(
                {name: 'English', value: 'en-US'},
                {name: '日本語', value: 'ja'},
                {name: '한국어', value: 'ko'},
                {name: '中文(繁體)', value: 'zh-TW'},
                {name: '中文(简体)', value: 'zh-CN'},
                {name: 'Español', value: 'es-ES'},
                {name: 'Français', value: 'fr'},
                {name: 'Português', value: 'pt-BR'},
                {name: 'Українська', value: 'uk'},
            )
        ),
    async execute(interaction) {
        const rules = require('../../text/rules.json');
        const ruleNumber = interaction.options.getInteger('rule');
        let locale = interaction.options.getString('locale') || interaction.locale;
        if (locale === "en-GB") locale = "en-US";
        if (!rules[locale]) locale = "en-US";
        if (!rules[locale][ruleNumber]) {
            await interaction.reply({ content: 'Rule not found', ephemeral: true });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(`Rule ${ruleNumber} - ${rules[locale][ruleNumber].title}`)
            .setDescription(rules[locale][ruleNumber].description)
            .setColor(0x00FF00)
            .setTimestamp();
        if (locale !== "en-US") embed.addFields({name: `Rule ${ruleNumber} - ${rules["en-US"][ruleNumber].title}`, value: `${rules["en-US"][ruleNumber].description}`});
        await interaction.reply({ embeds: [embed]});
    }
}
