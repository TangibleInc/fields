import * as fields from '../../../../../assets/src/index.tsx'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

describe('Accordion component', () => {

  it('renders', () => {
    
    render( 
      <>
        { fields.render({
          name    : 'accordion-name',
          type    : 'accordion',
          isOpen  : true,
          value   : { 
            subfield1 : 'Subvalue1', 
            subfield2 : 'Subvalue2'
          },
          fields  : [
            {
              label : 'Subfield 1',
              type  : 'text',
              name  : 'subfield1' 
            },
            {
              label : 'Subfield 2',
              type  : 'number',
              name  : 'subfield2' 
            },
          ]
        }) }
      </>
    )

    const accordion = document.getElementsByClassName('tf-accordion')
    expect(accordion.length).toBe(1)
    
    const input = accordion[0].querySelectorAll('input[name="accordion-name"]')
    expect(input.length).toBe(1)
    expect(input[0].parentElement.classList.contains('tf-accordion')).toBe(true)

    const fieldGroup = document.getElementsByClassName('tf-field-group')
    expect(fieldGroup.length).toBe(1)

    const items = fieldGroup[0].getElementsByClassName('tf-field-group-item')
    expect(items.length).toBe(2)

    const headerSwitch = fieldGroup[0].querySelectorAll('.tf-panel-header .tf-switch')
    expect(headerSwitch.length).toBe(0)
  })

  it('supports useSwitch attribute', async () => {
  
    render( 
      <>
        { fields.render({
          name      : 'accordion-name',
          type      : 'accordion',
          useSwitch : true,
          value     : {},
          fields    : []
        }) }
      </>
    )

    const headerSwitch = document.querySelectorAll('.tf-panel-header .tf-switch')
    expect(headerSwitch.length).toBe(1)
  })

  it('opens and closes on click on header', async () => {
    
    render( 
      <>
        { fields.render({
          name    : 'accordion-name',
          type    : 'accordion',
          value   : { 
            subfield1 : 'Subvalue1', 
            subfield2 : 'Subvalue2'
          },
          fields  : [
            {
              label : 'Subfield 1',
              type  : 'text',
              name  : 'subfield1' 
            },
            {
              label : 'Subfield 2',
              type  : 'text',
              name  : 'subfield2' 
            },
          ]
        }) }
      </>
    )

    const panel = document.querySelector('.tf-panel')
    const header = panel.querySelector('.tf-panel-header')

    expect(panel.getAttribute('data-status')).toBe('closed')

    const user = userEvent.setup()

    await user.click(header)
    expect(panel.getAttribute('data-status')).toBe('open')

    await user.click(header)
    expect(panel.getAttribute('data-status')).toBe('closed')
  })

  it('does not open content when click on witch', async () => {
  
    render( 
      <>
        { fields.render({
          name      : 'accordion-name',
          type      : 'accordion',
          useSwitch : true,
          value     : {},
          fields    : []
        }) }
      </>
    )

    const panel = document.querySelector('.tf-panel')
    const headerSwitch = panel.querySelector('.tf-panel-header .tf-switch')
    
    expect(headerSwitch).toBeTruthy()
    expect(panel.getAttribute('data-status')).toBe('closed')

    const user = userEvent.setup()

    await user.click(headerSwitch)
    expect(panel.getAttribute('data-status')).toBe('closed')
  })

  it('keeps uncontrolled content mounted but hidden while closed', () => {

    render(
      <>
        { fields.render({
          name         : 'accordion-name',
          type         : 'accordion',
          uncontrolled : true,
          fields       : [
            {
              label : 'Subfield 1',
              type  : 'text',
              name  : 'subfield1'
            }
          ]
        }) }
      </>
    )

    const panel = document.querySelector('.tf-panel')
    expect(panel.getAttribute('data-status')).toBe('closed')

    // behavior=hide: the field is in the DOM, TUI hides the panel
    const content = panel.querySelector('.tf-panel-content')
    expect(content).toBeTruthy()
    expect(content.querySelector('input')).toBeTruthy()
    expect(content.closest('.tui-accordion__panel').getAttribute('aria-hidden')).toBe('true')
  })

  it('removes controlled content while closed', () => {

    render(
      <>
        { fields.render({
          name   : 'accordion-name',
          type   : 'accordion',
          value  : {},
          fields : [{ label: 'Subfield 1', type: 'text', name: 'subfield1' }]
        }) }
      </>
    )

    expect(document.querySelector('.tf-panel .tf-panel-content')).toBeNull()
  })
})
