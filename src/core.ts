import { getWords } from './api'
import Search from './search'

interface TypoAuditPrototype {
  analize: (sentence: string) => any
}

async function GetTypoAudit (): Promise<TypoAuditPrototype> {
  const words = await getWords()
  const searchInstance = Search<string>(words)

  function analize (sentence: string) {
    const collectiveWords: string[] = sentence
      .replace(/[!%&'()*+./;<=>?\\,/:#@\t\r\n"\[\]_\u007B-\u00BF-]/g, '')
      .split(' ')

    let response: any = {}

    collectiveWords.forEach(word => {
      const searchResult = searchInstance.find(word)

      let result: boolean = false
      let suggestions: any = []

      if (searchResult.length) {
        result = searchResult[0].item.includes(word.toLowerCase()) ? true : false
        if (!result) {
          searchResult.map(suggest => {
            suggestions.push(suggest.item)
          })
        }
      }

      response[word] = {
        valid: result,
        suggestions: suggestions || null
      }
    })

    return response
  }

  return {
    analize
  }
}

export default GetTypoAudit