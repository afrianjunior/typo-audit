import { assert } from 'chai'
import Search from '../search'

describe('Search', function () {
  let searchInstance: any = null
  const customDataSet = ['mengapa', 'terjadi', 'apa', 'tidak', 'gelisah']

  before(function () {
    searchInstance = Search<string>(customDataSet)
  })

  describe('#Find specific word from data-set', function () {
    it(`Search.find should found \"mengapa\" from \"${customDataSet}\"`, function () {
      const result = searchInstance.find('apa')

      assert.typeOf(result, 'array', 'return of method find should be array')
      assert.equal(result.length, 1, 'length of result must 0')
    })
    
    it(`Result \"mengapa\" of Search.find should have refIndex 2 from \"${customDataSet}\"`, function () {
      const result = searchInstance.find('apa')
      const firstIndex = result[0]

      assert.equal(firstIndex.refIndex, 2, 'refIndex from first index should equal to 2')
    })
  });

  describe('#Find specific word not from data-set', function () {
    it(`Search.find should found \"jelas\" from \"${customDataSet}\"`, function () {
      const result = searchInstance.find('jelas')
      assert.typeOf(result, 'array', 'return of method find should be array')
      assert.equal(result.length, 0, 'length of result must 0')
    })
  })
})
