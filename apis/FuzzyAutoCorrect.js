import fuzzysort from 'fuzzysort'
import fs from 'fs'
import csv from 'csv-parser'

const tagList = []

fs.createReadStream('./apis/all_tags.csv')
  .pipe(csv())
  .on('data', row => {
    tagList.push(row.Tag)
  })
  .on('end', () => {
    console.log('CSV file parsed and tag list created.')
  })

export function autoCorrectTag (inputTag) {
  const results = fuzzysort.go(inputTag, tagList, {
    limit: 1, // Number of results to return
    threshold: -Infinity, // Adjust the threshold for sensitivity
    allowTypo: true // Allow for typos
  })

  return results.map(result => result.target)
}

