const { EmbedBuilder } = require('discord.js')

function formatLogEmbed (message) {
  const instant = new Date()
  const user = message.author
  const messageLink = `[**Jump To Message**](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`
  const channelLink = `[#${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`

  const embed = new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(user.tag)
    .setAuthor({ name: message.member.displayName, iconURL: user.avatarURL() })
    .setDescription(
      `** Message sent in ** ${channelLink}\n${messageLink}\n${message.content}`
    )
    .setThumbnail(user.avatarURL())
    .setFooter({ text: `User ID: ${user.id}` })
    .setTimestamp(instant)
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first()
    embed.setImage(attachment.url)
  }
  return embed
}

module.exports = { formatLogEmbed }
