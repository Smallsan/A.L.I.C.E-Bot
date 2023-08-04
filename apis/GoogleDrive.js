import { google } from 'googleapis'
import fs from 'fs'
import keys from '../keys.json' assert { type: 'json' }
import config from '../config/config.json' assert { type: 'json' }

const clientID = keys.clientID
const clientSecret = keys.clientSecret
const redirectURI = keys.redirectURI
const refreshToken = keys.refreshToken
const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI)

oauth2Client.setCredentials({ refresh_token: refreshToken })

const parentFolderID = [config.gdriveFolderID]

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})

export async function uploadToDriveAndShare(filePath) {
    try {
      const response = await drive.files.create({
        requestBody: {
          parents: [parentFolderID],
          webViewLink: true
        },
        media: {
          body: fs.createReadStream(filePath)
        }
      });
  
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });

      const shareLink = response.data.webViewLink;
      console.log('Share link:', shareLink);
  
      return shareLink;
    } catch (error) {
      console.log('Error uploading file:', error.message);
    }
  }

async function deleteFilesCreatedMoreThanOneHourAgo () {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const response = await drive.files.list({
      fields: 'files(id, name, createdTime)',
      q: `'${parentFolderID}' in parents and createdTime < '${oneHourAgo}'`
    })

    const files = response.data.files
    console.log('Files created more than one hour ago:')
    files.forEach(async file => {
      console.log(file.name, file.id, file.createdTime)
        await drive.files.delete({ fileId: file.id })
        console.log('File deleted successfully:', file.name)
    })
  } catch (error) {
    console.log(error)
  }
}

function runTaskEveryFiveMinutes () {
  deleteFilesCreatedMoreThanOneHourAgo()
  setInterval(() => {
    deleteFilesCreatedMoreThanOneHourAgo()
  }, 300000)
}

runTaskEveryFiveMinutes()
