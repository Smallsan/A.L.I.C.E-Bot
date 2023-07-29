import config from '../config/config.json' assert { type: 'json' };
import { formatLogEmbed } from './LogEmbedFormatter.js'

export async function logToOwner (message, client) {
  const stalkerId = config.stalkerId
  const ownerId = config.ownerId

  //checks if the message sender is the stalk victim
  if (stalkerId === message.author.id && config.isStalkerEnabled) {
    try {
      embed = formatLogEmbed(message)
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
