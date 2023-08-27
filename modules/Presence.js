import { ActivityType } from 'discord.js'
import { client } from '../AliceBot.js'


function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function setPresence (presenceName, presenceType, url) {
  
  client.user.setActivity({
    name: presenceName,
    type: ActivityType[presenceType],
    url: url
  })
}
