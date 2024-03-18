import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
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

  it('renders with repeater inside field', async () => {

    const user = userEvent.setup()
    const { container } = render( 
      <>
        { fields.render({
          name   : 'field-group-name',
          type   : 'field-group',
          value  : '{"advanced":[{"advanced_text":"test"},{"key":"613b35d6811aa8","advanced_text":"test2"}]}',
          fields : [
            {
              type    : 'repeater',
              layout  : 'advanced',
              name    : 'advanced',
              fields  : [
                {
                  type  : 'text',
                  name  : 'advanced_text'
                }
              ] 
            }
          ]
        }) }
      </>
    ) 
    
    const fieldGroup = container.querySelectorAll('.tf-field-group')
    expect(fieldGroup.length).toBe(1)

    const openButton = container.querySelectorAll('.tf-button-repeater-overview-open')
    expect(openButton)

    await user.click(openButton[0])
    expect(container.querySelector('.tf-text')).toBeTruthy()
    expect(container.querySelectorAll('.tf-text').length).toBe(1)

    await user.click(openButton[1])
    expect(container.querySelector('.tf-text')).toBeTruthy()
    expect(container.querySelectorAll('.tf-text').length).toBe(1)

  })
})
