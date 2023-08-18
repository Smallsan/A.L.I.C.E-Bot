import fs from 'fs'
import axios from 'axios'
import config from '../config/config.json' assert { type: 'json' }
import { compressFilesInFolder } from './FileCompressor.js'

let isLocalMessageLoggerEnabled = config.isLocalMessageLoggerEnabled

export function logMessageToLocal (message) {
  if (isLocalMessageLoggerEnabled) {
    let currentDate = new Date()
    let formattedDate = currentDate.toISOString().slice(0, 10)

    //Directory stuff
    const logFolderPath = 'message-logs'
    if (!fs.existsSync(logFolderPath)) {
      fs.mkdirSync(logFolderPath)
    }

    const attachmentsFolderPath = `${logFolderPath}/attachments`
    if (!fs.existsSync(attachmentsFolderPath)) {
      fs.mkdirSync(attachmentsFolderPath)
    }

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

    //creates a log file
    function createLogFile () {
      const logFileNamePrefix = 'message-log'
      const formattedDate = new Date().toISOString().slice(0, 10)
      const logFileName = `${logFileNamePrefix}-${formattedDate}.txt`
      return `${logFolderPath}/${logFileName}`
    }

    let logFilePath = createLogFile()

    // checks date in intervals if it changed
    setInterval(() => {
      const newLogFile = createLogFile()
      if (newLogFile !== logFilePath) {
        logFilePath = newLogFile
      }
    }, 600000)

    //checks if there were attachments in the messages and downloads them
    if (message.attachments.size > 0) {
      message.attachments.forEach(async attachment => {
        const url = attachment.url
        const fileExtension = attachment.name.split('.').pop()
        const fileName = `${tempFolderPath}/${formattedDate}-${Date.now()}.${fileExtension}`

        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, 'binary')
          fs.writeFileSync(fileName, buffer)
          console.log(`Downloaded: ${fileName}`)
        } catch (error) {
          console.error(error)
        }
      })
      fs.appendFile(logFilePath, log, err => {
        if (err) {
          console.error('Error writing to log file:', err)
        }
      })
    }

    // deletes all files in attachments
    function clearTempAttachments () {
      fs.readdir(tempFolderPath, (err, files) => {
        if (err) {
          console.error('Error reading temp folder:', err)
          return
        }

        files.forEach(file => {
          const filePath = `${tempFolderPath}/${file}`
          fs.unlink(filePath, err => {
            if (err) {
              console.error('Error deleting file:', err)
            } else {
              console.log(`Deleted: ${filePath}`)
            }
          })
        })
      })
    }

    // compresses the files in the folder every interval
    setInterval(() => {
      const filesInTempFolder = fs.readdirSync(tempFolderPath)
      if (filesInTempFolder.length > 0) {
        const compressedFileName = `${attachmentsFolderPath}/bundle-${formattedDate}.gz`
        compressFilesInFolder(tempFolderPath, compressedFileName, 9)
          .then(() => {
            console.log(`Compressed bundle created: ${compressedFileName}`)
            clearTempAttachments()
          })
          .catch(error => {
            console.error('Error compressing and clearing attachments:', error)
          })
      } else {
        console.log('nothing to compress')
      }
    }, 60 * 100) // 1 minute
  }
}
