import fs from 'fs'
import axios from 'axios'
import config from '../config/config.json' assert { type: 'json' }

//Work in progress, Will finish maybe tomorrow
function compressAndSaveFile (inputFilePath, outputFilePath, compressionLevel) {
  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(inputFilePath)
    const outputStream = fs.createWriteStream(outputFilePath)
    // 0-9 compression level, 9 is highest, 0 is none
    const gzip = zlib.createGzip({ level: compressionLevel })

    inputStream.pipe(gzip).pipe(outputStream)

    outputStream.on('finish', () => {
      resolve()
    })

    outputStream.on('error', error => {
      reject(error)
    })
  })
}

export function logMessageToLocal (message) {
  if (config.isLocalMessageLoggerEnabled) {
    //log directory path for the log and attachment files
    const logFolderPath = 'message-logs'
    const attachmentsFolderPath = `${logFolderPath}/attachments`

    //temp folder for attachments
    const tempFolderPath = 'message-logs/attachments/temp-attachments'
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath)
    }

    //format for the messages in the log file
    const { guild, channel, author, content } = message
    const logDate = new Date().toLocaleString()
    const logGuildName = guild.name
    const logChannelName = channel.name
    const logAuthorTag = author.tag
    const logAuthorId = author.id
    const log = `[${logDate}] ${logGuildName} - #${logChannelName}: ${logAuthorTag} (${logAuthorId}) - ${content}\n`

    //creates a log file with the
    function createLogFile () {
      const logFileNamePrefix = 'message-log'
      const formattedDate = new Date().toISOString().slice(0, 10)
      const logFileName = `${logFileNamePrefix}-${formattedDate}.txt`
      return `${logFolderPath}/${logFileName}`
    }

    //checks for the presence of the message-logs folder and the attachments folder and creates them if they're missing
    if (!fs.existsSync(logFolderPath)) {
      fs.mkdirSync(logFolderPath)
    }

    if (!fs.existsSync(attachmentsFolderPath)) {
      fs.mkdirSync(attachmentsFolderPath)
    }

    let logFilePath = createLogFile()

    const checkDateInterval = setInterval(() => {
      const newLogFile = createLogFile()
      if (newLogFile !== logFilePath) {
        logFilePath = newLogFile
      }
    }, 600000)

    //checks if there were attachments in the messages and downloads them
    if (message.attachments.size > 0) {
      message.attachments.forEach(async attachment => {
        const url = attachment.url
        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().slice(0, 10)
        const fileExtension = attachment.name.split('.').pop()
        const fileName = `${tempFolderPath}/${formattedDate}-${Date.now()}.${fileExtension}`

        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, 'binary')
          fs.writeFileSync(fileName, buffer)
          console.log(`Downloaded: ${fileName}`)

          // if (config.enableAttachmentCompression) {
          //   console.log('Insert future compression logic')
          // }

        } catch (error) {
          console.error(error)
        }
      })
    }

    fs.appendFile(logFilePath, log, err => {
      if (err) {
        console.error('Error writing to log file:', err)
      }
    })

  }
}
