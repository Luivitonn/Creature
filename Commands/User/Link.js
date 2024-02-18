const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

module.exports = {
    name: "link",
    aliases: ["link","url"],
    usage: [".link"],
    category: "USER",
    
    async execute(client, message, args, embed) {

    if(!message.guild.vanityURLCode) return message.reply({ content:"Sunucuda özel url bulunmuyor."});

    const link = await message.guild.fetchVanityData();

    message.reply({ content: `discord.gg/${message.guild.vanityURLCode}\nUrl Kullanımı: **${link.uses}**`})
     },

  };