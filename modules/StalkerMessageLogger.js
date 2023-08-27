import config from '../config/config.json' assert { type: 'json' };
import { formatLogEmbed } from './LogEmbedFormatter.js'
import { client } from '../AliceBot.js'


let isStalkerEnabled = config.isStalkerEnabled
let stalkerId = config.stalkerId
let ownerId = config.ownerId


export async function logToOwner (message) {

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
