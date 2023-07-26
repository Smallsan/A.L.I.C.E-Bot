const { formatLogEmbed }= require('./LogEmbedFormatter')
const config = require('../config/config.json')

function logMessageToChannel (message, client) {
  const channelId = config.messageLoggerChannelId
  const messageChannel = client.channels.cache.get(channelId)

  //checks if the message was sent in a text channel
  if (messageChannel?.isTextBased() && config.isChannelMessageLoggerEnabled) {
    const embed = formatLogEmbed(message)
    messageChannel.send({ embeds: [embed] })
  } else {
    console.log('Target channel not found or is not a text channel.')
  }
}

module.exports = { logMessageToChannel }
