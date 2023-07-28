import fetch from 'node-fetch'

export async function fetchDanbooruUrl (tag, client) {

  try {
    // takes images from safebooru instead of danbooru to be safe "wink"
    const url = `https://safebooru.donmai.us/posts.json?tags=${encodeURIComponent(
      tag
    )}+-rating:explicit&random=true`

    const response = await fetch(url)
    const data = await response.json()

    if (data.length > 0) {
      const tags = data[0].tag_string.split(' ')
      const imageUrl = data[0].file_url
      console.log('Danbooru fetched a url:', imageUrl, tag)
      return imageUrl
    } else {
      console.log('No results found for the specified tag ' + tag)
      return 'No results found for the specified tag ' + tag
    }
  } catch (error) {
    console.error('Error fetching url:', error)
    throw error
  }
}
