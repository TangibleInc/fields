import '../../../../assets/src/index.tsx'
import { userEvent } from '@testing-library/user-event'
import { createInput } from '../../../../assets/src/codemirror/index.ts'

describe('codeMirror - Mask', () => {

  const masks = [

    // Numerical

    [ '0', '9', '0' ],
    [ '0', '99', '0_' ],
    [ '0', '999', '0__' ],
    [ '01', '999', '01_' ],
    [ '012', '999', '012' ],
    [ '0123', '999', '012' ],
    [ 'AAA', '999', '___' ],
    [ '01A', '999', '01_' ],
    [ '123', '999-999', '123-___' ],
    [ '123-456', '999-999', '123-456' ],
    [ '123-abc', '999-999', '123-___' ],
    [ '123', '999/999', '123/___' ],
    [ '123/456', '999/999', '123/456' ],
    [ '123/abc', '999/999', '123/___' ],

    // Alphabetical

    [ 'a', 'a', 'a' ],
    [ 'a', 'aa', 'a_' ],
    [ 'a', 'aaa', 'a__' ],
    [ 'ab', 'aaa', 'ab_' ],
    [ 'abc', 'aaa', 'abc' ],
    [ 'abcd', 'aaa', 'abc' ],
    [ 'ABC', 'aaa', 'ABC' ],
    [ 'ab1', 'aaa', 'ab_' ],
    [ 'abc', 'aaa-aaa', 'abc-___' ],
    [ 'abc-def', 'aaa-aaa', 'abc-def' ],
    [ 'abc-123', 'aaa-aaa', 'abc-___' ],
    [ 'abc', 'aaa/aaa', 'abc/___' ],
    [ 'abc/def', 'aaa/aaa', 'abc/def' ],
    [ 'abc/123', 'aaa/aaa', 'abc/___' ],
    
    // Alphanumeric

    [ '0', '***', '0__' ],
    [ '01', '***', '01_' ],
    [ '012', '***', '012' ],
    [ '0123', '***', '012' ],
    [ 'AAA', '***', 'AAA' ],
    [ '01A', '***', '01A' ],
    [ 'a', '***', 'a__' ],
    [ 'ab', '***', 'ab_' ],
    [ 'abc', '***', 'abc' ],
    [ 'abcd', '***', 'abc' ],
    [ 'ABC', '***', 'ABC' ],
    [ 'ab1', '***', 'ab1' ],
    [ 'abc-def', '***-***', 'abc-def' ],
    [ 'abc-123', '***-***', 'abc-123' ],
    [ 'abc', '***/***', 'abc/___' ],
    [ 'abc/def', '***/***', 'abc/def' ],
    [ 'abc/123', '***/***', 'abc/123' ],

    // Mixed

    [ 'a', 'a9*', 'a__' ],
    [ '1', 'a9*', '___' ],
    [ 'a1', 'a9*', 'a1_' ],
    [ 'aa', 'a9*', 'a__' ],
    [ 'aa', 'a9*', 'a__' ],
    [ 'a1a', 'a9*', 'a1a' ],
    [ 'a11', 'a9*', 'a11' ],

  ]

  test.each(masks)('supports inputMask - Test with params %s, %s, %s', async (value, mask, expected) => {

    const user = userEvent.setup()
    const container = document.createElement('textarea')
    document.body.appendChild(container)
    
    const codeMirror = createInput(
      container, 
      '', () => {}, [], '',
      { inputMask : mask }, ''
    )

    codeMirror.contentDOM.focus()
    await user.type(codeMirror.contentDOM, value)
    const content = container.querySelector('.cm-line')
    
    expect(content.textContent).toBe(expected)
  })
})
