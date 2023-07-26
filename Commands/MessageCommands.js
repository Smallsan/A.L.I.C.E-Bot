const config = require('../config/config.json')
const { fetchDanbooruUrl } = require('../apis/danbooru')
const prefix = config.prefix

async function messageCommands (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const arguments = message.content.slice(prefix.length).trim().split(' ')
  const command = arguments.shift().toLowerCase()
  const combinedArguments = arguments.join('')

  if (command === 'danbooru') {
    const url = await fetchDanbooruUrl(combinedArguments)
    message.channel.send(url)
  }
}

module.exports = { messageCommands }
