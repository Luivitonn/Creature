const { ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, ComponentType, EmbedBuilder, AttachmentBuilder } = require("discord.js")

const botRoles = require("../../Config/configRoles")
const botConfig = require("../../Config/config")
const botEmojis = require("../../Config/configEmojis")
const botSilents = require("../../Config/configSilent")
const botChannels = require("../../Config/configChannels")

module.exports = {
    name: "yardım",
    aliases: ["yardım","help"],
    category: "KULLANICI",
    
    async execute(client, message, args, embed) {

       
       
      message.reply({ embeds: [embed.setThumbnail(message.guild.iconURL({dynamic:true})).setDescription(`**Aşağıda sunucudaki komutlar sıralandırılmıştır. Toplam \`${client.commands.size}\` tane komut kullanılabilir.**
      
      \`\`\`
-             #Kullanıcı Komutları
- .afk
- .bilgi @Lui/ID
- .çek @Lui/ID
- .git @Lui/ID
- .help
- .link
- .nerde @Lui/ID
- .zengin
-              #Stats Komutları
- .me
- .invites
- .top
-              #Yetkili Komutları
- .baglantıkes @Lui/ID
- .cezabilgi @Lui/ID
- .ihlal
- .kilit
- .say
- .sil
-               #Kayıt Komutları
- .isim @Lui/ID isim yaş
- .isimler @Lui/ID
- .kayıt @Lui/ID isim yaş
- .kayıtsız @Lui/ID
-               #Ceza Komutları
- .chatmute @Lui/ID
- .jail @Lui/ID
- .voicemute @Lui/ID
- .unchatmute @Lui/ID
- .unjail @Lui/ID
- .unvoicemute @Lui/ID
-               #Owner Komutları
- .emoji
- .kontrol
- .taglıalım
- .yetkilisay

\`\`\``)] })
           },
         };
    

  ;
