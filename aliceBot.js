const { Client, Intents, GatewayIntentBits } = require('discord.js')
const { logMessageToLocal } = require('./modules/LocalMessageLogger')
const { logMessageToChannel } = require('./modules/ChannelMessageLogger')
const { logToOwner } = require('./modules/StalkerMessageLogger')
const { setPresence } = require('./modules/Presence')
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
})
const keys = require('./keys.json')
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  setPresence(client)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  logMessageToLocal(message)
  logMessageToChannel(message, client)
  logToOwner(message, client)
})

client.login(keys.discordApi)
