import '../../../assets/src/index.jsx'
import { 
  render,
} from '@testing-library/react'

const fields = window.tangibleFields

describe('visibility conditions feature', () => {

  it('use object inside visibility condition', () => {

    const { container } = render( 
      <>
        { fields.render({
          name   : 'field-group-name',
          type   : 'field-group',
          fields : [
            {
              label   : 'Subfield 1',
              type    : 'combo-box',
              name    : 'subfield1', 
            },
            {
              label   : 'Subfield 2',
              type    : 'text',
              name    : 'subfield2',
              condition : {
                action : 'show',
                condition : {
                  'subfield1.value' : { '_eq' : 'test' }
                }
              }
            },
          ],
          value : JSON.stringify(
            {
              subfield1 : { value: 'test', label: 'Name 1' }
            }
          )
        }) }
      </>
    )

    const fieldText = container.querySelectorAll('.tf-text')
    expect(fieldText.length).toBe(1)
  })
})