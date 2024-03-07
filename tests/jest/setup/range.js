/**
 * Needed to avoid issue when using UserEvent.type()
 * 
 * @see https://github.com/jsdom/jsdom/issues/3002#issue-652790925
 */
document.createRange = () => {
  
  const range = new Range()

  range.getBoundingClientRect = jest.fn()
  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn()
    }
  }

  return range
}
