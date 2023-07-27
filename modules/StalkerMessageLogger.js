import config from ('../config/config.json')
import { formatLogEmbed } from('./LogEmbedFormatter')

async function logToOwner (message, client) {
  const stalkerId = config.stalkerId
  const ownerId = config.ownerId

  //checks if the message sender is the stalk victim
  if (stalkerId === message.author.id && config.isStalkerEnabled) {
    embed = formatLogEmbed(message)
    try {
      const user = await client.users.fetch(ownerId)
      if (user) {
        const dmChannel = await user.createDM()
        await dmChannel.send({ embeds: [embed] })
        console.log('Direct message sent successfully.')
      } else {
        console.log('User not found.')
      }
    } catch (error) {
      console.error('Error sending direct message:', error)
    }
  }
}

module.exports = { logToOwner }
