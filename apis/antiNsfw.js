import nsfwjs from 'nsfwjs'
import axios from 'axios'
import tf from '@tensorflow/tfjs-node'
import sharp from 'sharp'

const nsfwModel = await nsfwjs.load()

function isSupportedImage (contentType) {
  return contentType.startsWith('image/')
}

export async function checkAttachments (message) {
  for (const attachment of message.attachments.values()) {
    const attachmentContent = await axios.get(attachment.url, {
      responseType: 'arraybuffer'
    })

    const contentType = attachmentContent.headers['content-type']

    if (!isSupportedImage(contentType)) {
      // must be a video file
      console.log('Unsupported content type:', contentType)
      continue
    }

    const imageBuffer = attachmentContent.data

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 224, height: 224, fit: sharp.fit.inside, interpolator: 'bicubic' }) 
      .toBuffer();

    const image = tf.node.decodeImage(resizedImageBuffer)

    const predictions = await nsfwModel.classify(image)

    console.log(predictions)

    image.dispose()

    const probabilityTolerance = 0.7

    if (
      predictions[0].probability > probabilityTolerance &&
      (predictions[0].className === 'Porn' ||
        predictions[0].className === 'Hentai')
    ) {
      try {
        await message.delete()
        console.log('An explicit image was deleted')
        message.channel.send('An explicit image was deleted')
        // Insert punishment for user or something
        return
      } catch (error) {
        console.error('Error deleting message', error)
      }
    }
  }
}
