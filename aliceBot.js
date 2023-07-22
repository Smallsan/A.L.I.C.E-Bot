const { Client, Intents, GatewayIntentBits } = require('discord.js');
const { logMessage } = require('./modules/messageLogger');
const { logMessageToChannel } = require('./modules/MessageChannelLogger');
const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds ] });
const keys = require("./keys.json")
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    logMessage(message);
    logMessageToChannel(message, client);

    
});

client.login(keys.discordApi);

