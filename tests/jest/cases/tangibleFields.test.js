import '../../../assets/src/index.jsx'
import { render, within, act } from '@testing-library/react'

const fields = window.tangibleFields

describe('window.tangibleFields', () => {
  
  it('exists', () => {
    expect(window.tangibleFields).toBeDefined()
  })

  it('can render fields', () => {
    
    expect(typeof fields.render).toBe('function')

    const { container } = render(
      fields.render({
        label : 'Label',
        type  : 'text',
        name  : 'test-field' 
      })
    )
    
    const classes = container.firstChild.classList
    expect(classes.contains('tf-context-default')).toEqual(true)
  })

  it('can trigger and subscribe to events', () => {
    
    expect(typeof fields.event).toBe('function')
    expect(typeof fields.trigger).toBe('function')
    
    let eventCalled = 0
    fields.event('test-event', () => {
      eventCalled++
    })

    fields.trigger('test-event')
    expect(eventCalled).toBe(1)

    fields.trigger('test-event')
    expect(eventCalled).toBe(2)
  })

  it('can access the fields values', () => {
    
    expect(typeof fields.store).toBe('object')
    
    render(
      fields.render({
        label : 'Label',
        type  : 'text',
        name  : 'test-field-store',
        value : 'test-field-store-value'
      })
    )

    expect(fields.store.getValue('test-field-store')).toBe('test-field-store-value')
  })

  it('has access to utils functions', () => expect(typeof fields.utils).toBe('object'))
  
  it('can get registered field types', () => {
  
    expect(typeof fields.types).toBe('object')

    const Text = fields.types.get('text')
    
    expect(typeof Text).toBe('function')

    const { container } = render(
      <Text 
        name="field-name" 
        label="Label for text type" 
        value="Initial value" 
      />
    )
  
    expect(within(container).getByLabelText(`Label for text type`)).toBeTruthy()
    expect(within(container).getByText(`Initial value`)).toBeTruthy()
  })

  it('can register a new custom field type', () => {
  
    fields.types.add('custom-field', props => (
      <div className="tf-custom-field">
        <input type="text" name={ props.name } defaultValue={ props.value } />  
        <span>{ props.customAttribute }</span>
      </div> 
    ))
    
    const CustomField = fields.types.get('custom-field')
    expect(typeof CustomField).toBe('function')

    const { container } = render(
      fields.render({
        type            : 'custom-field',
        name            : 'custom-field-name',
        customAttribute : 'custom-field-attribute',
        value           : 'custom-field-value'
      })
    )

    expect(within(container).getByDisplayValue(`custom-field-value`)).toBeTruthy()
    expect(within(container).getByText(`custom-field-attribute`)).toBeTruthy()
  })

  it('has access to fields functions', () => expect(typeof fields.fields).toBe('object'))

  it('can re-render a field', () => {

    render(
      fields.render({
        type  : 'text',
        name  : 'test-rerender',
        label : 'Test re-render',
        value : ''
      })
    )
    
    let eventHasBeenTriggered = false
    fields.event('_fieldRerender', fieldName => {
      eventHasBeenTriggered = fieldName === 'test-rerender'
    })

    act(() => fields.fields.rerender('test-rerender'))
    
    expect(eventHasBeenTriggered).toBe(true)
  })
})
