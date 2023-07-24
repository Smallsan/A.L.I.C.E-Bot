const config = require('../config/config.json')
const { embedFormatter } = require('./EmbedFormatter')

async function informOwner (message, client) {
  const stalkerId = config.stalkerId
  const ownerId = config.ownerId
  if (stalkerId === message.author.id && config.isStalkerEnabled) {
    embed = embedFormatter(message)
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

module.exports = { informOwner }
