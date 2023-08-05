import zlib from 'zlib'
import path from 'path'
import fs from 'fs'

export async function compressFilesInFolder (
  inputFolderPath,
  outputFilePath,
  compressionLevel
) {
  try {
    const outputStream = fs.createWriteStream(outputFilePath)
    const gzip = zlib.createGzip({ level: compressionLevel })

    const files = fs.readdirSync(inputFolderPath)
    const filePromises = []

    files.forEach(file => {
      const filePath = path.join(inputFolderPath, file)
      const inputStream = fs.createReadStream(filePath)
      const compressPromise = new Promise((resolve, reject) => {
        inputStream
          .pipe(gzip, { end: false })
          .on('error', reject)
          .on('end', resolve)
      })
      filePromises.push(compressPromise)
    })

    await Promise.all(filePromises)

    // End the gzip stream and wait for it to finish writing
    gzip.pipe(outputStream)
    gzip.on('end', () => {
      outputStream.end()
    })

    await streamToPromise(outputStream)
  } catch (error) {
    console.log('Error compressing files:', error)
  }
}
