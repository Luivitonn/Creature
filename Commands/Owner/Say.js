const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

module.exports = {
    name: 'say',
    aliases: [],
    description: "Say Sistemi",
    discordPermissions: [PermissionsBitField.Flags.Administrator],
    permissions: [botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let totalTagges = await message.guild.members.cache.filter(member => (member.user.displayName.includes(botConfig.server.tag) + member.user.discriminator.includes(botConfig.server.discrimTag))).size;
        let totalVoice = message.guild.members.cache.filter(x => x.voice.channel).size;
        let totalVoiceBot = message.guild.members.cache.filter(x => x.user.bot === true && x.voice.channel).size
        let includeNameTag = await message.guild.members.cache.filter(member => (member.user.displayName.includes(botConfig.server.tag))).size;
        let includeDiscriminator = await message.guild.members.cache.filter(member => (member.user.discriminator.includes(botConfig.server.discrimTag))).size;
        message.channel.send({
          embeds: [embed
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`
        ${botEmojis.Register.okEmoji} Şu anda toplam **${totalVoice}** (**+${totalVoiceBot} Bot**) kişi seslide.
        ${botEmojis.Register.okEmoji} Sunucuda **${message.guild.memberCount}** adet üye var
        ${botEmojis.Register.okEmoji} Toplamda **${totalTagges}** kişi tagımızı alarak bizi desteklemiş.
        ${botEmojis.Register.okEmoji} Toplamda **${message.guild.premiumSubscriptionCount}** adet boost basılmış! (**${message.guild.premiumTier}** seviye)`)
    
          ]
        })

    }
}