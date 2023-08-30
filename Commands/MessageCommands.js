import config from '../config/config.json' assert { type: 'json' }
import { fetchBooruUrl } from '../apis/BooruFetcher.js'
import { client } from '../AliceBot.js'
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
