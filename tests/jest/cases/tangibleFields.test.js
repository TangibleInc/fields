import '../../../assets/src/index.jsx'
import { render } from '@testing-library/react'

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

})
