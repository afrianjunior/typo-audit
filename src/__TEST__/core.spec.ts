import { assert } from 'chai'
import GetTypoAudit from '../core'

describe('Core', function () {
  let TypoAudit: any = null
  let result = {}

  before(async function () {
    this.timeout(30000);
    TypoAudit = await GetTypoAudit()
  })

  beforeEach(function () {
    result = TypoAudit.analyze('pembekalan nilai anak muda indonesia')
  })

  describe('#TypoAudit analyze with correct sentence', function () {
    
    it('TypoAudit analyzer should return list of words from kbbi.now.sh as object', async function () {
      assert.typeOf(result, 'object')
    })
    
    it('TypoAudit analyzer should return all words is correct word', async function () {
      let allCorrect = true
      Object.entries(result).forEach(([_, { valid }]: any) => {
        if (!valid) allCorrect = false
      })

      assert.equal(allCorrect, true, 'sentence must be no one of word is invalid')
    })

    it('TypoAudit analyzer should return all words with no suggestions', async function () {
      let allWordsHasSuggestions = false
      Object.entries(result).forEach(([_, { suggestions }]: any) => {
        if (suggestions.length) allWordsHasSuggestions = true
      })

      assert.equal(allWordsHasSuggestions, false, 'sentence must be no one of word has suggestions')
    })
  });
});