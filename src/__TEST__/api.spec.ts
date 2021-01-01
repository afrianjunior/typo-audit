import { assert } from 'chai'
import { getWords } from '../api'

describe('Api', function() {
  describe('#getWords from https://kbbi.now.sh', function() {
    it('getWords should return list of words from kbbi.now.sh', async function () {
      this.timeout(30000);
      const words = await getWords()
      assert.typeOf(words, 'array')
    })
  });
});