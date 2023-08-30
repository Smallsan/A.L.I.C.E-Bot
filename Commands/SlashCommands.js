import { client } from '../AliceBot.js'
import { ChannelMessageLoggerStatus, setMessageLoggerChannelId, showMessageLoggerChannelId } from '../modules/ChannelMessageLogger.js'
import { LocalMessageLoggerStatus } from '../modules/LocalMessageLogger.js'
import { stalkerStatus, setRecipientId, setStalkerId, showRecipientId, showStalkerId } from '../modules/StalkerMessageLogger.js'
import { danbooruStatus, safebooruStatus, setBooruChannelId, showBooruChannelId, setMessageCommandPrefix, showMessageCommandPrefix, toggleDanbooru, toggleSafebooru } from './MessageCommands.js'

// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isCommand()) return;
  
//     const command = interaction.commandName;

//     if (command === 'ping') {
//       await interaction.reply('Pong!');
//     }
//   });


  // async () => {
  //   await client.api.applications(client.user.id).guilds(guildId).commands.post({
  //     data: {
  //       name: 'ping',
  //       description: 'Replies with Pong!',
  //     },
  //   })}