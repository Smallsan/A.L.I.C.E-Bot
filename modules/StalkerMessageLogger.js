import config from '../config/config.json' assert { type: 'json' };
import { formatLogEmbed } from './LogEmbedFormatter.js'

let isStalkerEnabled = config.isStalkerEnabled

export async function logToOwner (message, client) {
  const stalkerId = config.stalkerId
  const ownerId = config.ownerId


  if (stalkerId === message.author.id && isStalkerEnabled) {
    try {
      const embed = formatLogEmbed(message)
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
