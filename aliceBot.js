import { Client, GatewayIntentBits, ActivityType } from 'discord.js'
import { logMessageToLocal } from './modules/LocalMessageLogger.js'
import { logMessageToChannel } from './modules/ChannelMessageLogger.js'
import { logToOwner } from './modules/StalkerMessageLogger.js'
import { setPresence } from './modules/Presence.js'
import { messageCommands } from './Commands/MessageCommands.js'
import config from '../config/config.json' assert { type: 'json' };
import keys from './keys.json' assert { type: 'json' }

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  ]
})


function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function setPresence () {
  const presenceName = config.presenceName
  const presenceType = capitalizeFirstLetter(config.presenceType)
  const url = config.url

  client.user.setActivity({
    name: presenceName,
    type: ActivityType[presenceType],
    url: url
  })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  setPresence()
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  logMessageToLocal(message)
  logMessageToChannel(message, client)
  logToOwner(message, client)
  messageCommands(message, client)
})



client.login(keys.discordTestApi)
