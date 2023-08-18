import fetch from 'node-fetch'
import { autocorrectTag } from './FuzzyAutoCorrect'

export async function fetchBooruUrl (tag, booru) {
  try {
    let url

    if (booru === 'danbooru') {
      url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(
        tag
      )}+-rating:explicit&random=true`
    } else if (booru === 'safebooru') {
      url = `https://safebooru.donmai.us/posts.json?tags=${encodeURIComponent(
        tag
      )}+-rating:explicit&random=true`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.length > 0) {
      const tag = data[0].tag_string.split(' ')
      const imageUrl = data[0].file_url
      console.log(booru + ' fetched a url:', imageUrl, tag)
      return imageUrl
    } else {
      console.log('No results found for the specified tag ' + tag)
      return 'did you perhaps mean', autocorrectTag(tag)
    }
  } catch (error) {
    console.error('Error fetching url:', error)
    throw error
  }
}
