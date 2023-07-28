import config from '../config/config.json' assert { type: 'json' }
import { fetchDanbooruUrl } from '../apis/danbooru.js'
const prefix = config.prefix

export async function messageCommands (message, client) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')
  const commandSentChannel = message.channel

  const danbooruChannelId = config.danbooruChannelId
  const danbooruChannel = client.channels.cache.get(danbooruChannelId)

  if (command === 'danbooru' && config.isDanbooruEnabled && commandSentChannel === danbooruChannel) {
    const url = await fetchDanbooruUrl(combinedArguments, client)
    if (url) {
      message.channel.send(url)
    } else {
      message.channel.send('No results found for the specified tag.')
    }
  }
}
