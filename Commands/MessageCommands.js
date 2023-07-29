import config from '../config/config.json' assert { type: 'json' }
import { fetchBooruUrl } from '../apis/BooruFetcher.js'
const prefix = config.prefix

export async function messageCommands (message, client) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')
  const commandSentChannel = message.channel

  const booruChannelId = config.booruChannelId
  const booruChannel = client.channels.cache.get(booruChannelId)

  if (
    config.isBooruEnabled &&
    (commandSentChannel === booruChannel || booruChannelId === '')
  ) {
    let url
    if (command === 'danbooru') {
      url = await fetchBooruUrl(combinedArguments, command)
    } else if (command === 'safebooru') {
      url = await fetchBooruUrl(combinedArguments, command)
    }
    if (url) {
      message.channel.send(url)
    } else {
      message.channel.send('No results found for the specified tag.')
    }
  }
}
