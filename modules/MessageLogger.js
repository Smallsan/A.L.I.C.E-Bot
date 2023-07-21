const fs = require('fs');
const axios = require('axios');

function logMessage(message) {

  //log directory path for the log and attachment files
  const logFolderPath = 'message-logs';
  const attachmentsFolderPath = `${logFolderPath}/attachments`;


  //format for the messages in the log file
  const { guild, channel, author, content } = message;
  const logDate = new Date().toLocaleString();
  const logGuildName = guild.name;
  const logChannelName = channel.name;
  const logAuthorTag = author.tag;
  const logAuthorId = author.id;
  const log = `[${logDate}] ${logGuildName} - #${logChannelName}: ${logAuthorTag} (${logAuthorId}) - ${content}\n`;

  //creates a log file with the 
  function createLogFile() {
    const logFileNamePrefix = 'message-log';
    const formattedDate = new Date().toISOString().slice(0, 10);
    const logFileName = `${logFileNamePrefix}-${formattedDate}.txt`;
    return `${logFolderPath}/${logFileName}`;
  }

  //checks for the presence of the message-logs folder and the attachments folder and creates them if they're missing
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath);
  }

  if (!fs.existsSync(attachmentsFolderPath)) {
    fs.mkdirSync(attachmentsFolderPath);
  }

  let logFilePath = createLogFile();

  //checks date in intervals and creates a seperate log text file per date (every 10 minutes)
  const checkDateInterval = setInterval(() => {
    const newLogFile = createLogFile();
    if (newLogFile !== logFilePath) {
      logFilePath = newLogFile;
    }
  }, 600000);

  //checks if there were attachments in the messages and downloads them 
  if (message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      const url = attachment.url;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
      const fileExtension = attachment.name.split('.').pop();
      const fileName = `${attachmentsFolderPath}/${formattedDate}-${Date.now()}.${fileExtension}`;

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        fs.writeFileSync(fileName, buffer);
        console.log(`Downloaded: ${fileName}`);
      } catch (error) {
        console.error('Error downloading attachment:', error);
      }
    });
  }

  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

module.exports = { logMessage };