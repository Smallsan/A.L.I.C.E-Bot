import config from ('../config/config.json')
import { fetchDanbooruUrl } from ('../apis/danbooru')
const prefix = config.prefix

async function messageCommands (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(' ')
  const command = args.shift().toLowerCase()
  const combinedArguments = args.join('')

  if (command === 'danbooru') {
    const url = await fetchDanbooruUrl(combinedArguments)
    message.channel.send(url)
  }
}

module.exports = { messageCommands }
