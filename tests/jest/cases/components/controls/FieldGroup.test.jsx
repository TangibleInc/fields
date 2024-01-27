import '../../../../../assets/src/index.jsx'
import { render, within } from '@testing-library/react'

const fields = window.tangibleFields

describe('Field group component', () => {

  it('renders with elements inside fields', () => {
    
    const { container } = render( 
      <>
        { fields.render({
          name   : 'field-group-name',
          type   : 'field-group',
          fields : [
            {
              type    : 'description',
              content : 'Test 1',
              name    : 'subfield1', 
            },
            {
              label   : 'Subfield 2',
              type    : 'text',
              name    : 'subfield2' 
            },
          ]
        }) }
      </>
    )

    const fieldGroup = container.querySelectorAll('.tf-field-group')
    expect(fieldGroup.length).toBe(1)
    
    expect(container.querySelector('.tf-description'))
    expect(within(container).getByText('Test 1')).toBeTruthy()
    
    expect(container.querySelector('.tf-text'))
    expect(within(container).getByText('Subfield 2')).toBeTruthy()

  })
})
