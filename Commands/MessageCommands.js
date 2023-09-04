import config from '../config/config.json' assert { type: 'json' }
import { fetchBooruUrl } from '../apis/BooruFetcher.js'
import { client } from '../AliceBot.js'
import fs from 'fs'
import {
  ChannelMessageLoggerStatus,
  toggleChannelMessageLogger,
  setMessageLoggerChannelId,
  showMessageLoggerChannelId
} from '../modules/ChannelMessageLogger.js'
import {
  LocalMessageLoggerStatus,
  toggleLocalMessageLogger,
  setCompressForEvery,
  showCompressForEvery,
  toggleAttachmentCompressor,
  attachmentCompressorStatus
} from '../modules/LocalMessageLogger.js'
import {
  stalkerStatus,
  toggleStalker,
  setRecipientId,
  setStalkerId,
  showRecipientId,
  showStalkerId
} from '../modules/StalkerMessageLogger.js'

let messageCommandPrefix = config.prefix
let isDanbooruEnabled = config.isDanbooruEnabled
let isSafebooruEnabled = config.isSafebooruEnabled
let booruChannelId = config.booruChannelId

let isLoggingMessages = false

function isInDanbooruChannel (commandSentChannel) {
  if (booruChannelId == '' || booruChannel == commandSentChannel) {
    return true
  } else {
    const booruChannel = client.channels.cache.get(booruChannelId)
    if (booruChannel == commandSentChannel) {
      return true
    }
    return false
  }
}

async function logEveryMessageInChannel (channel) {
  if (isLoggingMessages) {
    channel.send('The command is already active.')
    return
  }
  isLoggingMessages = true

  try {
    const messagesToFetch = Infinity
    const delayBetweenRequests = 1000

    const messages = []
    let lastMessageID = null

    for (let i = 0; i < messagesToFetch / 100; i++) {
      const fetchedMessages = await channel.messages.fetch({
        limit: 100,
        before: lastMessageID
      })

      messages.push(...fetchedMessages.values())

      console.log(i * 100 + ' recorded messages')

      if (fetchedMessages.size === 0) {
        break
      }

      lastMessageID = fetchedMessages.last().id
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests))
    }

    const logDate = new Date().toISOString().replace(/:/g, '-')
    const logGuildName = channel.guild.name.replace(/ /g, '_')
    const logChannelName = channel.name.replace(/ /g, '_')

    const logContent = messages
      .map(m => `[${m.createdAt}] ${m.author.tag}: ${m.content}`)
      .join('\n')

    const logFilePath = `./message-logs/${logGuildName}-${logChannelName}-${logDate}-backup.txt`

    fs.writeFileSync(logFilePath, logContent)

    channel.send(`Logged ${messages.length} messages.`)
    if (messages.length <= 100000){
      channel.send({ files: [logFilePath] })
    }
    console.log(`Logged messages to ${logFilePath}`)
  } catch (error) {
    console.error(error)
  } finally {
    isLoggingMessages = false
  }
}

export async function messageCommands (message) {
  if (!message.content.startsWith(messageCommandPrefix) || message.author.bot)
    return

  const args = message.content
    .slice(messageCommandPrefix.length)
    .trim()
    .split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')
  const commandSentChannel = message.channel

  const isEnabledDanbooru =
    command === 'danbooru' &&
    isDanbooruEnabled &&
    isInDanbooruChannel(commandSentChannel)
  const isEnabledSafebooru =
    command === 'safebooru' &&
    isSafebooruEnabled &&
    isInDanbooruChannel(commandSentChannel)

  if (isEnabledDanbooru || isEnabledSafebooru) {
    const url = await fetchBooruUrl(combinedArguments, command)
    if (url) {
      message.channel.send(url)
    } else {
      message.channel.send('No results found for the specified tag.')
    }
  }

  if (command === 'showstatus') {
    message.channel.send(
      '```js' +
        '\n' +
        'Message Commands Prefix: ' +
        showMessageCommandPrefix() +
        '\n' +
        'Stalker Status: ' +
        stalkerStatus() +
        '\n' +
        'Stalker Id: ' +
        showStalkerId() +
        '\n' +
        'Recepient Id: ' +
        showRecipientId() +
        '\n' +
        'Danbooru Status: ' +
        danbooruStatus() +
        '\n' +
        'Safebooru Status: ' +
        safebooruStatus() +
        '\n' +
        'Booru Channel Id: ' +
        showBooruChannelId() +
        '\n' +
        'Local Message Logger Status: ' +
        LocalMessageLoggerStatus() +
        '\n' +
        'Attachment Compressor Status: ' +
        attachmentCompressorStatus() +
        '\n' +
        'Compresses For Every: ' +
        showCompressForEvery() +
        '\n' +
        'Channel Message Logger Status: ' +
        ChannelMessageLoggerStatus() +
        '\n' +
        'Channel Message Logger Id: ' +
        showMessageLoggerChannelId() +
        '\n' +
        '```'
    )
  }

  if (command === 'logchannel') {
    logEveryMessageInChannel(message.channel)
  }
  if (command === 'logeverychannel') {
    const guild = message.guild
    const channels = guild.channels.cache.filter(channel => channel.type === 'text')
    console.log(`Total text channels: ${channels.size}`);
    channels.forEach(async channel => {
      await logEveryMessageInChannel(channel)
      
    })
  }
}

export function toggleDanbooru () {
  if (isDanbooruEnabled === true) {
    isDanbooruEnabled = false
  } else {
    isDanbooruEnabled = true
  }
}

export function danbooruStatus () {
  return isDanbooruEnabled
}

export function toggleSafebooru () {
  if (isSafebooruEnabled === true) {
    isSafebooruEnabled = false
  } else {
    isSafebooruEnabled = true
  }
}

export function safebooruStatus () {
  return isSafebooruEnabled
}

export function setBooruChannelId (channelId) {
  booruChannelId = channelId
}

export function showBooruChannelId () {
  return booruChannelId
}

export function setMessageCommandPrefix (prefix) {
  messageCommandPrefix = prefix
}

export function showMessageCommandPrefix () {
  return messageCommandPrefix
}
