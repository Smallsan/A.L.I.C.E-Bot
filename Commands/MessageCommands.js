import config from '../config/config.json' assert { type: 'json' };
import { fetchDanbooruUrl } from '../apis/danbooru.js'
const prefix = config.prefix

export async function messageCommands (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')

  if (command === 'danbooru') {
    const url = await fetchDanbooruUrl(combinedArguments)
    message.channel.send(url)
  }
}
