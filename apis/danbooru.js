async function fetchDanbooruUrl (tag) {
  try {
    const url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(
      tag
    )}+-rating:explicit&random=true`

    const fetch = await import('node-fetch')
    const response = await fetch.default(url)
    const data = await response.json()

    if (data.length > 0) {
      const imageUrl = data[0].file_url
      console.log('Danbooru fetched a url:', imageUrl)
      return imageUrl
    } else {
      console.log('No results found for the specified tag.')
      return 'No results found for the specified tag.'
    }
  } catch (error) {
    console.error('Error fetching url:', error)
    throw error
  }
}

module.exports = { fetchDanbooruUrl }
