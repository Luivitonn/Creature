const client = require("../Handlers/clientHandler.js");

const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionsBitField,
  StringSelectMenuBuilder,
  ComponentType,
  EmbedBuilder,
  codeBlock,
} = require("discord.js");

const botRoles = require("../Config/configRoles");
const botConfig = require("../Config/config");
const botEmojis = require("../Config/configEmojis");
const botSilents = require("../Config/configSilent");
const botChannels = require("../Config/configChannels");

const userSchema = require("../Database/userSchema");
const punishSchema = require("../Database/punishSchema");
const infractionSchema = require("../Database/infractionSchema");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const welcomeChat = client.channels.resolve(
      botChannels.Register.registerChat,
    );
    const taggesLog = client.channels.resolve(botChannels.Logs.tagLog);

    const fakeControl =
      Date.now() - member.user.createdTimestamp <
      1000 * 60 * 60 * 24 * botConfig.server.fakeDay;
    const pdb = await punishSchema.findOne({
      guildID: member.guild.id,
      userID: member.id,
      punishmentContinue: true,
    });

    if (
      member.user.displayName.includes(botConfig.server.tag) ||
      member.user.displayName.includes(botConfig.server.discrimTag)
    ) {
      taggesLog.wsend({
        content: `${member} [\` ${member.id} \`]`,
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: member.guild.name,
              iconURL: member.guild.iconURL({ dynamic: true }),
            })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor("Random")
            .setDescription(`${member} adlı kullanıcı <t:${Math.floor(
            Date.now() / 1000,
          )}:R> sunucumuza taglı olarak giriş yaptı.
                `),
        ],
      });
    }

    if (pdb) {
      return welcomeChat.wsend({
        content: `${member} kullanıcısı sunucuya katıldı fakat aktif bir cezası olduğu için ceza işlemini tekrar başlatıyorum.`,
      });
    }

    if (fakeControl) {
      member.setNickname(`Şüpheli Kullanıcı`);
      member.roles.set([botRoles.Silent.Suspicious]);
      return welcomeChat.wsend({
        content: `${member} kullanıcısı sunucuya katıldı fakat hesabı (<t:${Math.floor(
          member.user.createdTimestamp / 1000,
        )}:R>) açıldığı için şüpheli olarak işaretlendi.`,
      });
    }

    member.setNickname(
      `${
        member.user.username.includes(botConfig.server.tag) ||
        member.user.discriminator.includes(botConfig.server.discrimTag)
          ? botConfig.server.noTag
          : botConfig.server.noTag
      } İsim | Yaş`,
    );
    member.user.displayName.includes(botConfig.server.tag) ||
    member.user.discriminator.includes(botConfig.server.discrimTag)
      ? member.roles.add([
          botRoles.Register.tagRoles,
          ...botRoles.Register.unregRoles,
        ])
      : member.roles.add(botRoles.Register.unregRoles);
    welcomeChat.wsend({
      content: `
**${member.guild.name}** sunucusuna hoşgeldin ${member}!
 Seninle beraber sunucumuz **${member.guild.memberCount}** kullanıcı oldu 🎉

Hesabınız <t:${Math.floor(
        member.user.createdTimestamp / 1000,
      )}> tarihinde oluşturulmuş (<t:${Math.floor(
        member.user.createdTimestamp / 1000,
      )}:R>).
 Sunucumuza destekte bulunmak istersen boost basarak destek olabilirsiniz.

 Topluluk kurallarımıza <#${
   botChannels.Utils.rulesChat
 }> kısmından bakabilirsiniz, şuandan itibaren kuralları okumuş sayılıyorsunuz.
(${botRoles.Register.staffRoles.map((x) => `<@&${x}>`)})

${codeBlock(
  "fix",
  "Sunucumuza Kayıt Olduktan Sonra Kurallar Kanalına Göz Atmayı Unutma,Sunucu İçerisi Cezalandırmalarımızı Kurallar Kanalına Göre Belirliyoruz İyi Eğlenceler Dilerim...",
)}`,
    });
  },
};
