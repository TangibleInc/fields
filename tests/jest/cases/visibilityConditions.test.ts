import * as fields from '../../../assets/src/index.tsx'
import { userEvent } from '@testing-library/user-event'
import { 
  render, 
  act,
  within ,
  screen
} from '@testing-library/react'

/**
 * TODO:
 * - Test all conditions
 * - Test operators (and/or/mixed)
 * - Test nested value from multiple level of nesting (regular/field-groups/repeater) 
 */

describe('visibility conditions feature', () => {

  it('use object attribute as watched value', async () => {

    const { container } = render( 
      <>
        { fields.render({
          label     : 'Label dimensions',
          name      : 'dimensions-name',
          type      : 'dimensions'
        }) }
        { fields.render({
          label     : 'Label text',
          name      : 'text-name',
          type      : 'text',
          condition : {
            action    : 'show',
            condition : {
              'dimensions-name.top' : { '_eq' : 5 }
            }
          }
        }) }
      </>
    )

    expect(within(container).queryByLabelText('Label text')).toBeFalsy()

    const user = userEvent.setup()
    const topInput = container.querySelector('.tf-number-field').firstChild
    
    await act(async () => {
      await topInput.focus()
      await user.type(topInput, '5')
      await topInput.blur() // value is applied only when we lose focus
    })
    
    expect(
      await within(container).findByLabelText('Label text')
    ).toBeTruthy()
  })

  it('use object attribute as watched value inside a field group', () => {

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

    let fieldText = container.querySelectorAll('.tf-text')
    expect(fieldText.length).toBe(1)

    act(() => {
      fields.store.setValue('field-group-name', JSON.stringify({
        subfield1 : { value: 'hide', label: 'Name 2' }
      }))
    })

    fieldText = container.querySelectorAll('.tf-text')
    expect(fieldText.length).toBe(0)
  })

  it('use object attribute as watched value inside a repeater', async () => {

    const { container } = render( 
      fields.render({
        name   : 'repeater-name',
        type   : 'repeater',
        fields : [
          {
            label     : 'Dimensions label',
            type      : 'dimensions',
            name      : 'dimensions-name', 
          },
          {
            label     : 'Text label',
            type      : 'text',
            name      : 'text-name',
            condition : {
              action    : 'show',
              condition : {
                'dimensions-name.top' : { '_eq' : 5 }
              }
            }
          }
        ]
      })
    )

    expect(within(container).queryByLabelText('Text label')).toBeFalsy()

    const user = userEvent.setup()
    const topInput = container.querySelector('.tf-number-field').firstChild
    
    await act(async () => {
      await topInput.focus()
      await user.type(topInput, '5')
      await topInput.blur() // value is applied only when we lose focus
    })
    
    expect(
      await within(container).findByLabelText('Text label')
    ).toBeTruthy()
  })
})
