import { Client, Intents, GatewayIntentBits } from 'discord.js'
import { logMessageToLocal } from './modules/LocalMessageLogger'
import { logMessageToChannel } from './modules/ChannelMessageLogger'
import { logToOwner } from './modules/StalkerMessageLogger'
import { setPresence } from './modules/Presence'
import { messageCommands } from './Commands/MessageCommands'
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
  messageCommands(message)
})

client.login(keys.discordTestApi)
