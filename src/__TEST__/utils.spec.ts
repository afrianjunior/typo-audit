import { assert } from 'chai'
import { getKeywordFromKBBIURL } from '../utils'

describe('Utils', function () {
  describe('#getKeywordFromKBBIURL', function () {
    it('getKeywordFromKBBIURL should return \"hei\" from \"https://kbbi.kemdikbud.go.id/entri/hei\"', function () {
      const input = 'https://kbbi.kemdikbud.go.id/entri/hei'
      const output = getKeywordFromKBBIURL(input)

      assert.equal(output, 'hei', `insert ${input} to getKeywordFromKBBIURL and return \"hei\"`);
    })

    it('getKeywordFromKBBIURL should return \"kata\" from \"https://kbbi.kemdikbud.go.id/cari/hasil?frasa=kata\"', function () {
      const input = 'https://kbbi.kemdikbud.go.id/cari/hasil?frasa=kata'
      const output = getKeywordFromKBBIURL(input)

      assert.equal(output, 'kata', `insert ${input} to getKeywordFromKBBIURL and return \"kata\"`);
    })
  })
})
