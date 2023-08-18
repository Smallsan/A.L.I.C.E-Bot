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
    console.log('CSV file parsed and tag list created.');
  });

export function autocorrectTag(inputTag) {
  const results = fuzzysort.go(inputTag, tagList, {
    limit: 5, // Number of results to return
    threshold: -10000, // Adjust the threshold for sensitivity
    allowTypo: true // Allow for typos
  })

  return results.map(result => result.target)

}