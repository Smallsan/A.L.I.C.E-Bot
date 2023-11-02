import config from '../config/config.json' assert { type: 'json' }
import { formatLogEmbed } from './log-embed-formatter.js'
import { client } from '../discord-bot.js'

let isStalkerEnabled = config.isStalkerEnabled
let stalkerId = config.stalkerId
let recipientId = config.recipientId

export async function logToOwner (message) {
  if (stalkerId === message.author.id && isStalkerEnabled) {
    try {
      const embed = formatLogEmbed(message)
      const user = await client.users.fetch(recipientId)
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

export function toggleStalker () {
  if (isStalkerEnabled === true) {
    isStalkerEnabled = false
  } else {
    isStalkerEnabled = true
  }
}

export function stalkerStatus () {
  return isStalkerEnabled
}

export function setStalkerId (userId) {
  stalkerId = userId
}

export function showStalkerId () {
  return stalkerId
}

export function setRecipientId (userId) {
  recipientId = userId
}

export function showRecipientId () {
  return recipientId
}
