import { ActivityType } from 'discord.js'
import { client } from '../discord-bot.js'

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function setPresence (presenceName, presenceType, url) {
  client.user.setActivity({
    name: presenceName,
    type: ActivityType[capitalizeFirstLetter(presenceType)],
    url: url
  })
}
