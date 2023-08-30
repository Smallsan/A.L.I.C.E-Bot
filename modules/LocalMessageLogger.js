import fs from 'fs'
import axios from 'axios'
import config from '../config/config.json' assert { type: 'json' }
import archiver from 'archiver'

let isLocalMessageLoggerEnabled = config.isLocalMessageLoggerEnabled
let isAttachmentCompressionEnabled = config.isAttachmentCompressionEnabled
let compressForEvery = 5


export function compressBuffers (buffers, compressionLevel) {
  const combinedBuffer = Buffer.concat(buffers)
  return zlib.gzipSync(combinedBuffer, { level: compressionLevel })
}

export function logMessageToLocal (message) {
  if (isLocalMessageLoggerEnabled) {
    let currentDate = new Date()
    let formattedDate = currentDate.toISOString().slice(0, 10)

    const logFolderPath = 'message-logs'
    if (!fs.existsSync(logFolderPath)) {
      fs.mkdirSync(logFolderPath)
    }

    const attachmentsFolderPath = `${logFolderPath}/attachments`
    if (!fs.existsSync(attachmentsFolderPath)) {
      fs.mkdirSync(attachmentsFolderPath)
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

    if (isAttachmentCompressionEnabled && message.attachments.size > 0) {
      const compressedBuffers = []
      let counter = 0
      const archive = archiver('zip', {
        zlib: { level: 9 } // Set the compression level
      })

      archive.on('error', err => {
        console.error('Error while creating archive:', err)
      })

      message.attachments.forEach(async attachment => {
        const url = attachment.url
        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data)
          compressedBuffers.push({ name: attachment.name, data: buffer }) 

          counter++

          if (counter >= compressForEvery) {
            const archiveFileName = `${attachmentsFolderPath}/${formattedDate}-${Date.now()}.zip`
            const output = fs.createWriteStream(archiveFileName)
            archive.pipe(output)

            compressedBuffers.forEach(compressedAttachment => {
              archive.append(compressedAttachment.data, {
                name: compressedAttachment.name
              })
            })

            archive.finalize()
            console.log(`Compressed and saved: ${archiveFileName}`)

            compressedBuffers.length = 0 
            counter = 0 
          }
        } catch (error) {
          console.error(error)
        }
      })

      if (compressedBuffers.length > 0) {
        const archiveFileName = `${attachmentsFolderPath}/${formattedDate}-${Date.now()}.zip`
        const output = fs.createWriteStream(archiveFileName)
        archive.pipe(output)

        compressedBuffers.forEach(compressedAttachment => {
          archive.append(compressedAttachment.data, {
            name: compressedAttachment.name
          })
        })

        archive.finalize()
        console.log(`Compressed and saved: ${archiveFileName}`)
      }
    } else {
      // Attachment compression is disabled, just save the attachments
      message.attachments.forEach(async attachment => {
        const url = attachment.url
        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data)
          const attachmentFileName = `${attachmentsFolderPath}/${formattedDate}-${attachment.name}`
          fs.writeFileSync(attachmentFileName, buffer)
          console.log(`Saved attachment: ${attachmentFileName}`)
        } catch (error) {
          console.error(error)
        }
      })

    }
  }
}

export function toggleLocalMessageLogger () {
  if (isLocalMessageLoggerEnabled === true) {
    isLocalMessageLoggerEnabled = false
  } else {
    isLocalMessageLoggerEnabled = true
  }
}

export function LocalMessageLoggerStatus () {
  return isLocalMessageLoggerEnabled
}

export function toggleAttachmentCompressor () {
  if (isLocalMessageLoggerEnabled === true) {
    isLocalMessageLoggerEnabled = false
  } else {
    isLocalMessageLoggerEnabled = true
  }
}

export function attachmentCompressorStatus () {
  return isAttachmentCompressionEnabled
}

export function setCompressForEvery (forEvery) {
  compressForEvery = forEvery

}

export function showCompressForEvery () {
  return compressForEvery
}