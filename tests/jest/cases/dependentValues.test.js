import '../../../assets/src/index.jsx'
import { 
  render, 
  within, 
  act
} from '@testing-library/react'

const fields = window.tangibleFields

/**
 * TODO:
 * - Improve repeater tests by adding test when multiple rows
 * - Test dependent value in nested objects/arrays
 * - Test dependent value in field-group
 */

describe('dependent value feature', () => {

  it('does nothing if dependent not defined', () => {
 
    render(
      <>
        { fields.render({
          label       : 'Field 1',
          type        : 'text',
          value       : 'Initial value of field 1',
          name        : 'test-field-1' 
        }) }
        <div className="tested-element">
          { fields.render({
            type        : 'text', 
            label       : '{{test-field-1}}',
          }) }
        </div>
      </>
    )

    const dependentField = document.getElementsByClassName('tested-element')[0] 
    expect(dependentField).toBeTruthy()

    const initialLabel = within(dependentField).getByText('{{test-field-1}}')
    expect(initialLabel).toBeTruthy()
    expect(initialLabel.getAttribute('class')).toBe('tf-label')
  })

  it('does nothing if dependent is set to false', () => {
 
    render(
      <>
        { fields.render({
          label       : 'Field 1',
          type        : 'text',
          value       : 'Initial value of field 1',
          name        : 'test-field-1' 
        }) }
        <div className="tested-element">
          { fields.render({
            type        : 'text', 
            label       : '{{test-field-1}}',
            dependent   : false
          }) }
        </div>
      </>
    )

    const dependentField = document.getElementsByClassName('tested-element')[0] 
    expect(dependentField).toBeTruthy()

    const initialLabel = within(dependentField).getByText('{{test-field-1}}')
    expect(initialLabel).toBeTruthy()
    expect(initialLabel.getAttribute('class')).toBe('tf-label')
  })

  it('works for regular fields', async () => {

    render(
      <>
        { fields.render({
          label       : 'Field 1',
          type        : 'text',
          value       : 'Initial value of field 1',
          name        : 'test-field-1' 
        }) }
        <div className="tested-element">
          { fields.render({
            label       : '{{test-field-1}}',
            type        : 'text',
            description : '{{test-field-3}}',
            dependent   : true,
          }) }
        </div>
        { fields.render({
          label       : 'Field 2',
          type        : 'text',
          value       : 'Initial value of field 3',
          name        : 'test-field-3'
        }) }
      </>
    )

    const dependentField = document.getElementsByClassName('tested-element')[0] 
    expect(dependentField).toBeTruthy()

    const initialLabel = within(dependentField).getByText('Initial value of field 1')
    expect(initialLabel).toBeTruthy()
    expect(initialLabel.getAttribute('class')).toBe('tf-label')

    const initialDescription = within(dependentField).getByText('Initial value of field 3')
    expect(initialDescription).toBeTruthy()
    expect(initialDescription.getAttribute('class')).toBe('tf-description')

    act(() => {
      fields.store.setValue('test-field-1', 'Updated value field 1') 
      fields.store.setValue('test-field-3', 'Updated value field 3')
    })

    const updatedLabel = await within(dependentField).findByText('Updated value field 1')
    expect(updatedLabel).toBeTruthy()
    expect(updatedLabel.getAttribute('class')).toBe('tf-label')

    const updatedDescription = await within(dependentField).findByText('Updated value field 3')
    expect(updatedDescription).toBeTruthy()
    expect(updatedDescription.getAttribute('class')).toBe('tf-description')
  })

  it('works for repeater fields', async () => {

    render(
      <>
        { fields.render({
          label   : 'Field 1',
          type    : 'text',
          value   : 'Initial value of field 1',
          name    : 'field-1' 
        }) }
        { fields.render({
          label   : 'Label',
          name    : 'repeater-field',
          type    : 'repeater',
          layout  : 'block',
          value   : [
            { 'key': 1, 'subfield-1' : 'Initial value of the repeater subfield 1' },
          ],
          fields  : [
            {
              label       : 'Subfield 1',
              type        : 'hidden',
              name        : 'subfield-1' 
            },
            {
              label       : '{{field-1}}',
              description : '{{subfield-1}}',
              type        : 'text',
              name        : 'subfield-2',
              dependent   : true
            }
          ]
        }) }
      </>
    )

    const itemsContainer = document.querySelector(`.tf-repeater-items`)
    expect(itemsContainer.childNodes.length).toBe(1)

    const dependentLabel = await within(itemsContainer.childNodes[0]).findByText('Initial value of field 1')
    expect(dependentLabel).toBeTruthy()
    expect(dependentLabel.getAttribute('class')).toBe('tf-label')
    
    const dependentDescription = await within(itemsContainer.childNodes[0]).findByText('Initial value of the repeater subfield 1')
    expect(dependentDescription).toBeTruthy()
    expect(dependentDescription.getAttribute('class')).toBe('tf-description')
    
    // TODO: Add test when multiple rows and after update but needs to understand why re-render not complete in tests first

  })
  
})
