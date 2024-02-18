const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

const userSchema = require("../../Database/userSchema")
const punishSchema = require("../../Database/punishSchema")
const infractionSchema = require("../../Database/infractionSchema")

const ms = require('ms')

module.exports = {
    name: 'cmute',
    aliases: ['chat-mute', 'chatmute', 'cm'],
    description: "Cmute Sistemi",
    discordPermissions: [PermissionsBitField.Flags.ManageRoles],
    permissions: [...botRoles.Moderation.muteRoles, ...botRoles.Moderation.commanderRoles],
    channels: [],
    ownerOnly: false,
    async execute(client, message, args, embed) {

        let member = message.mentions.members.first() || message.guild.members.resolve(args[0]);

        if(!member) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji}Lütfen bir ${!member ? "üye" : ""} belirtiniz.`)] }).delete(5)
        
        if(member.id === message.author.id) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji} Kendini sustaramazsın.`)] }).delete(5)
        if(member.id === client.user.id) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji} Botu susturamazsın.`)] }).delete(5)
        if(member.id === message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji} Sunucu Sahibini susturamazsın.`)] }).delete(5)
        if(member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji} Belirtilen üyeyi susturamazsın.`)] }).delete(5)
        if(member.roles.cache.has(botRoles.Silent.ChatMute)) return message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.cancelEmoji} Belirtilen üye zaten metin kanallarında susturulmuş.`)] }).delete(5)

        let count = await punishSchema.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        let Array = []
        botSilents.cmute.forEach(x => { Array.push({ label: x.label, description: x.description, value: x.value })})
        const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Yapılacak eylemi seçin.')
            .setOptions(Array)
        )

        let msg = await message.reply({ embeds: [embed.setDescription(`${botEmojis.Register.warningEmoji} Lütfen yapılacak eylemi seçin.`)], components: [row] })
        let collector = await msg.createMessageComponentCollector({ ComponentType: ComponentType.StringSelect, time: 30 * 1000, max: 1 })

        collector.on('collect', async (interaction) => {

            if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [embed.setDescription(`${botEmojis.Register.warningEmoji} Bu komutu sadece ${message.author} kullanabilir.`)], ephemeral: true })

            for (let i = 0; i < botSilents.cmute.length; i++) {

                const index = botSilents.cmute[i];
                let value = interaction.values[0];
                if(value === index.value) {
                    cmute(member, index.label, index.time, index.description, interaction, count)
                }

            }

        })

        collector.on('end', async (interaction) => {

            if(msg) msg.delete()

        })

        async function cmute (user, reason, time, timeLength, button, count) {

            const cmute = client.channels.resolve(botChannels.Logs.cmuteLog)

            let data = {
                guildID: message.guild.id,
                executor: message.author.id,
                cezaID: count,

                userID: user.id,
                punishmentAt: Date.now(),
                punishmentFinish: (Date.now() + ms(time)),
                punishmentType: "CMUTE",
                punishmentReason: reason,
                punishmentContinue: true,
            }

            await button.channel.send({ embeds: [
                embed.setDescription(`${botEmojis.Register.verifyEmoji} ${message.member}, ${user} adlı kullanıcı başarıyla metin kanallarında susturuldu!`)
            ] })

            await user.roles.add(botRoles.Silent.ChatMute, `Susturulma sebebi: ${reason} | Susturulma süresi: ${timeLength} | Yetkili: ${message.author.tag} (${message.author.id})`)
            await new punishSchema(data).save()
            await infractionSchema.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, { $inc: { CMute: 1, punishmentPoint: botSilents.point.cmute }}, { upsert: true })

            cmute.wsend({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true })})
                    .setTitle(`#${count} Numaralı Yeni Ceza`)
                    .setColor('Random')
                    .setFooter({ text: `${botConfig.server.footer}`, iconURL: client.user?.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setDescription(`${user} (\`${user.id}\`) adlı kullanıcı ${button.user} tarafından __metin__ kanallarında susturuldu.`)
                    .addFields({
                        name: `#${count} Numaralı cezanın detaylı bilgileri;`,
                        value: `
                        ${botEmojis.Register.okEmoji} Yetkili: ${button.user} (\`${button.user.tag} - ${button.user.id}\`)
                        ${botEmojis.Register.okEmoji} Kullanıcı: ${user} (\`${user.id}\`)
                        ${botEmojis.Register.okEmoji} İşlem: Metin Kanallarında Susturma (\`Chat Mute\`)
                        ${botEmojis.Register.okEmoji} Tarih: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
                        ${botEmojis.Register.okEmoji} Sebep: \`${reason}\`
                        ${botEmojis.Register.okEmoji} Süre: \`${timeLength}\``
                    })
                
                ]   
            })

        }

    }
}