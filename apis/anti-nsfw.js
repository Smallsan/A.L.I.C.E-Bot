import nsfwjs from 'nsfwjs'
import axios from 'axios'
import tf from '@tensorflow/tfjs-node'
import sharp from 'sharp'
import config from '../config/config.json' assert { type: 'json' }

let isAntiNsfwEnabled = config.isAntiNsfwEnabled

let probabilityTolerance = 0.8

const nsfwModel = await nsfwjs.load()

function isSupportedImage (contentType) {
  return contentType.startsWith('image/')
}

export async function checkAttachments (message) {
  if (isAntiNsfwEnabled) {
    for (const attachment of message.attachments.values()) {
      const url = attachment.url
      const contentType = attachment.contentType

      if (isSupportedImage(contentType)) {
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer', 
          });

          const imageBuffer = response.data;

          const resizedImageBuffer = await sharp(imageBuffer)
            .toFormat('jpg')
            .toBuffer();

          const image = tf.node.decodeImage(resizedImageBuffer);

          const predictions = await nsfwModel.classify(image);

          console.log(predictions);

          image.dispose();

          if (
            predictions[0].probability > probabilityTolerance &&
            (predictions[0].className === 'Porn' ||
              predictions[0].className === 'Hentai')
          ) {
            try {
              await message.delete();
              console.log('An explicit image was deleted');
              message.channel.send('An explicit image was deleted');
              return;
            } catch (error) {
              console.error('Error deleting message', error);
            }
          }
        } catch (error) {
          console.error('Error fetching image', error);
        }
      } else {
        console.log('Unsupported content type:', contentType);
      }
    }
  }
}



export function toggleAntiNsfw () {
  if (isAntiNsfwEnabled === true) {
    isAntiNsfwEnabled = false
  } else {
    isAntiNsfwEnabled = true
  }
}

export function antiNsfwStatus () {
  return isAntiNsfwEnabled
}
