const Discord = require('discord.js');
const client = global.client = new Discord.Client({ intents: [3276799], partials: [Discord.Partials.GuildMember, Discord.Partials.User, Discord.Partials.Channel] });
const config = require('../Config/config');
client.login(process.env.token);

client.commands = new Discord.Collection();

module.exports = client
