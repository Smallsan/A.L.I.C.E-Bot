import { Client, GatewayIntentBits } from 'discord.js'
import { logMessageToLocal } from './modules/local-message-logger.js'
import { logMessageToChannel } from './modules/channel-message-logger.js'
import { logToOwner } from './modules/stalker-message-logger.js'
import { messageCommands } from './Commands/message-commands.js'
import { setPresence } from './modules/presence-manager.js'
import { checkAttachments } from './apis/anti-nsfw.js'
import config from './config/config.json' assert { type: 'json' }
import keys from './keys.json' assert { type: 'json' }

const presenceName = config.presenceName
const presenceType = config.presenceType
const url = config.url

export const client = new Client({
  autoReconnect: true,
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  setPresence(presenceName, presenceType, url)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  logMessageToLocal(message)
  logMessageToChannel(message)
  logToOwner(message)
  messageCommands(message)
  checkAttachments(message)
})

client.login(keys.discordKey)
