import Fuse from 'fuse.js'

export interface SearchPrototypes<T> {
  find: (word: string) => Fuse.FuseResult<T>[]
}

function Search<T> (data: T[]): SearchPrototypes<T> {
  const searchInstance = new Fuse(data, {
    findAllMatches: true,
    threshold: 0.0
  })

  function find (word: string): Fuse.FuseResult<T>[] {
    return searchInstance.search(word)
  }
  
  return {
    find
  }
}

export default Search