import axios from 'axios'
import { getKeywordFromKBBIURL } from './utils'

export function getWords (): Promise<string[]> {
  return new Promise<string[]>(function (resolve, reject) {
    let words: string[] = []

    axios.get('https://kbbi.now.sh')
      .then(({ data }) => {
        data.entries.map((entry: string) => {
          const word = getKeywordFromKBBIURL(entry)

          if (word) {
            words.push(word)
          }
        })
        resolve(words)
      })
      .catch(error => {
        reject(error)
      })
  })
}