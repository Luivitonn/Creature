const config =  require('../Config/config')
const botConfig =  require('../Config/config')
const channels =  require('../Config/configChannels')
const emojis =  require('../Config/configEmojis')
const roles =  require('../Config/configRoles')
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'userUpdate',
    async execute(oldUser, newUser) {

        let guild = client.guilds.cache.get(config.server.sunucuID)
        let member = guild.members.resolve(newUser.id)

        let tagLog = client.channels.resolve(channels.Logs.tagLog)
        let tagRole = roles.Register.tagRoles
        let cek = roles.allPermissions

            if(!oldUser.displayName.includes(config.server.tag) && newUser.displayName.includes(config.server.tag)) {

                await member.roles.add(tagRole)
            
            tagLog.wsend({
                content: `${member} [\` ${member.id} \`]`,
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${emojis.Register.okEmoji} ${member} adlı kullanıcı tagımızı alarak <t:${Math.floor(Date.now() / 1000)}:R> aramıza katıldı.`)
            
            ]
            })

        } else if(oldUser.displayName.includes(config.server.tag) && !newUser.displayName.includes(config.server.tag)) {

            await member.roles.remove(tagRole)
            await member.roles.remove(cek)
            tagLog.wsend({
                content: `${member} [\` ${member.id} \`]`,
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${emojis.Register.okEmoji} ${member} adlı kullanıcı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.`)
            
            ]
            })

        }

        if(oldUser.discriminator == (botConfig.server.discrimTag) && newUser.discriminator !== (botConfig.server.discrimTag)) {

            await member.roles.remove(tagRole)
            await member.roles.remove(cek)
            tagLog.wsend({ 
                content: `${member} [\` ${member.id} \`]`, 
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${emojis.Register.okEmoji} ${member} adlı kullanıcı tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.
                `)
            ]
        })

        } else if(oldUser.discriminator !== (botConfig.server.discrimTag) && newUser.discriminator == (botConfig.server.discrimTag)) {
        
            await member.roles.add(tagRole)

            tagLog.wsend({ 
                content: `${member} [\` ${member.id} \`]`, 
                embeds: [new EmbedBuilder()
                .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setDescription(`${emojis.Register.okEmoji} ${member} adlı kullanıcı tagımızı alarak <t:${Math.floor(Date.now() / 1000)}:R> aramıza katıldı.

                `)
            ]
        })

        }

    }
}