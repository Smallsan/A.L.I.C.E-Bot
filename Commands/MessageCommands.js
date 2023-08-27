import config from '../config/config.json' assert { type: 'json' }
import { fetchBooruUrl } from '../apis/BooruFetcher.js'
import { client } from '../AliceBot.js'

let prefix = config.prefix
let isDanbooruEnabled = config.isDanbooruEnabled
let isSafebooruEnabled = config.isSafebooruEnabled
let booruChannelId = config.booruChannelId


function isInDanbooruChannel(commandSentChannel) {
  
  if (booruChannelId == '' || booruChannel == commandSentChannel){
    return true
  }
  else{
    const booruChannel = client.channels.cache.get(booruChannelId)
    if (booruChannel == commandSentChannel){
      return true
    }
    return false
  }

}

export async function messageCommands (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')
  const commandSentChannel = message.channel

  if (
    command === 'danbooru' &&
    isDanbooruEnabled &&
    isInDanbooruChannel(commandSentChannel)
  ) {
    const url = await fetchBooruUrl(combinedArguments, command)
    if (url) {
      message.channel.send(url)
    } else {
      message.channel.send('No results found for the specified tag.')
    }
  }

  if (
    command === 'safebooru' &&
    isSafebooruEnabled &&
    isInDanbooruChannel(commandSentChannel)
  ) {
    const url = await fetchBooruUrl(combinedArguments, command)
    if (url) {
      message.channel.send(url)
    } else {
      message.channel.send('No results found for the specified tag.')
    }
  }

  
}
