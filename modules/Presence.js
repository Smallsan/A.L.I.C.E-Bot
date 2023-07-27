import config from('../config/config.json')
import { ActivityType } from ('discord.js')

//capitalizes the first letter of the string for the ActivityType
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

function setPresence (client) {
  const presenceName = config.presenceName
  const presenceType = capitalizeFirstLetter(config.presenceType)
  const url = config.url

  client.user.setActivity({
    name: presenceName,
    type: ActivityType[presenceType],
    url: url
  })
}

module.exports = { setPresence }
