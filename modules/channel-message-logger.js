import { formatLogEmbed } from './log-embed-formatter.js'
import config from '../config/config.json' assert { type: 'json' }
import { client } from '../discord-bot.js'

let isChannelMessageLoggerEnabled = config.isChannelMessageLoggerEnabled
let messageLoggerChannelId = config.messageLoggerChannelId

export function logMessageToChannel (message) {
  const messageChannel = client.channels.cache.get(messageLoggerChannelId)

  //checks if the message was sent in a text channel
  if (messageChannel?.isTextBased() && isChannelMessageLoggerEnabled) {
    const embed = formatLogEmbed(message)
    messageChannel.send({ embeds: [embed] })
  } else {
    console.log('Target channel not found or is not a text channel.')
  }
}

export function ChannelMessageLoggerStatus () {
  return isChannelMessageLoggerEnabled
}
export function toggleChannelMessageLogger () {
  if (isChannelMessageLoggerEnabled === true) {
    isChannelMessageLoggerEnabled = false
  } else {
    isChannelMessageLoggerEnabled = true
  }
}
export function setMessageLoggerChannelId (channelId) {
  messageLoggerChannelId = channelId
}
export function showMessageLoggerChannelId () {
  return messageLoggerChannelId
}
