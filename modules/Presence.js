import config from '../config/config.json' assert { type: 'json' };
import { ActivityType } from 'discord.js'

//capitalizes the first letter of the string for the ActivityType
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function setPresence (client) {
  const presenceName = config.presenceName
  const presenceType = capitalizeFirstLetter(config.presenceType)
  const url = config.url

  client.user.setActivity({
    name: presenceName,
    type: ActivityType[presenceType],
    url: url
  })
}

