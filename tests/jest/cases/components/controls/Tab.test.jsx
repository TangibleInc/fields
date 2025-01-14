import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
import { render, within } from '@testing-library/react'

const fields = window.tangibleFields

describe('Tab component', () => {

  it('renders', async () => {
    
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name    : 'tab-name',
        type    : 'tab',
        value   : { 
          'tab-1' : { 
            'text-name'   : 'Text value',
            'color-name'  : '#FF9900'
          },
          'tab-2' : { 
            'number-name' : 8
          }
        },
        tabs : {
          'tab-1' : {
            title : 'Title tab 1',
            fields : [
              {
                label : 'Text field',
                type  : 'text',
                name  : 'text-name' 
              },
              {
                label : 'Color field',
                type  : 'color-picker',
                name  : 'color-name' 
              }
            ]
          },
          'tab-2' : {
            title : 'Title tab 2',
            fields : [
              {
                label : 'Number field',
                type  : 'number',
                name  : 'number-name' 
              }
            ]
          }
        }
      })
    )
    
    const tab1 = within(container).getByText('Title tab 1')
    const tab2 = within(container).getByText('Title tab 2')

    expect(tab1.parentNode.getAttribute('data-open')).toBe('true')
    expect(tab2.parentNode.getAttribute('data-open')).toBe('false')
    
    expect(within(container).getByLabelText('Text field')).toBeTruthy()
    expect(within(container).getByLabelText('Color field')).toBeTruthy()
    expect(within(container).queryByLabelText('Number field')).toBeFalsy()

    await user.click(tab2)
    
    expect(tab1.parentNode.getAttribute('data-open')).toBe('false')
    expect(tab2.parentNode.getAttribute('data-open')).toBe('true')
    
    expect(within(container).queryByLabelText('Text field')).toBeFalsy()
    expect(within(container).queryByLabelText('Color field')).toBeFalsy()
    expect(within(container).getByLabelText('Number field')).toBeTruthy()
  })

})
