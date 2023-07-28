import { Client, GatewayIntentBits } from 'discord.js'
import { logMessageToLocal } from './modules/LocalMessageLogger.js'
import { logMessageToChannel } from './modules/ChannelMessageLogger.js'
import { logToOwner } from './modules/StalkerMessageLogger.js'
import { setPresence } from './modules/Presence.js'
import { messageCommands } from './Commands/MessageCommands.js'
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
})
import keys from './keys.json' assert { type: 'json' }
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  setPresence(client)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  logMessageToLocal(message)
  logMessageToChannel(message, client)
  logToOwner(message, client)
  messageCommands(message, client)
})

client.login(keys.discordTestApi)
