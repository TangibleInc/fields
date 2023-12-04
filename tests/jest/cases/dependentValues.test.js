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
 */

describe('dependent values feature', () => {

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

  it('works for field groups', async () => {

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
          name    : 'field-group-field',
          type    : 'field-group',
          value   : { 
            'key': 1, 
            'subfield-1': 'Initial value of the repeater subfield 1' 
          },
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

    const subfields = document.querySelectorAll(`.tf-field-group-item`)
    expect(subfields.length).toBe(2)

    const dependentLabel = await within(subfields[1]).findByText('Initial value of field 1')
    expect(dependentLabel).toBeTruthy()
    expect(dependentLabel.getAttribute('class')).toBe('tf-label')
    
    const dependentDescription = await within(subfields[1]).findByText('Initial value of the repeater subfield 1')
    expect(dependentDescription).toBeTruthy()
    expect(dependentDescription.getAttribute('class')).toBe('tf-description')
  })

  it('works for nested repeater fields', async () => {

    render(
      <>
        { fields.render({
          label   : 'Field 1',
          type    : 'text',
          value   : 'Value field 1',
          name    : 'field-1' 
        }) }
        { fields.render({
          label   : 'Label',
          name    : 'repeater-field',
          type    : 'repeater',
          layout  : 'block',
          value   : [
            { 
              key       : 1,
              subfield1 : 'Value first field repeater', 
              subfield2 : [
                {
                  key             : 1, 
                  nestedsubfield1 : 'Value first field nested repeater',
                  nestedsubfield2 : '',
                  nestedsubfield3 : '',
                  nestedsubfield4 : ''
                } 
              ]       
            }
          ],
          fields  : [
            {
              label : 'Subfield 1',
              type  : 'hidden',
              name  : 'subfield1' 
            },
            {
              label   : 'Label',
              name    : 'subfield2',
              type    : 'repeater',
              layout  : 'block',
              fields  : [
                {
                  label     : 'Nested subfield 1',
                  type      : 'text',
                  name      : 'nestedsubfield1'
                },
                {
                  label     : '{{field-1}}',
                  type      : 'text',
                  name      : 'nestedsubfield2',
                  dependent : true
                },
                {
                  label     : '{{subfield1}}',
                  type      : 'text',
                  name      : 'nestedsubfield3',
                  dependent : true
                },
                {
                  label     : '{{nestedsubfield1}}',
                  type      : 'text',
                  name      : 'nestedsubfield4',
                  dependent : true
                }
              ]
            }
          ]
        }) }
      </>
    )

    const repeaters = document.getElementsByClassName('tf-repeater-items')
    expect(repeaters.length).toBe(2)

    const [repeater, nestedRepeater] = repeaters

    expect(repeater.childNodes.length).toBe(1)
    expect(nestedRepeater.childNodes.length).toBe(1)

    const repeaterFields = repeater.querySelector('.tf-panel-content') 
    expect(repeaterFields.childNodes.length).toBe(2)

    const nestedRepeaterFields = nestedRepeater.querySelector('.tf-panel-content') 
    expect(nestedRepeaterFields.childNodes.length).toBe(4)

    expect(within(nestedRepeaterFields.childNodes[0]).getByLabelText('Nested subfield 1')).toBeTruthy()
    expect(within(nestedRepeaterFields.childNodes[1]).getByLabelText('Value field 1')).toBeTruthy()
    expect(within(nestedRepeaterFields.childNodes[2]).getByLabelText('Value first field repeater')).toBeTruthy()
    expect(within(nestedRepeaterFields.childNodes[3]).getByLabelText('Value first field nested repeater')).toBeTruthy()
  })

  it('works for nested field groups', async () => {
    
    render(
      <>
        { fields.render({
          label   : 'Field 1',
          type    : 'text',
          value   : 'Value field 1',
          name    : 'field-1' 
        }) }
        { fields.render({
          label   : 'Label',
          name    : 'field-group',
          type    : 'field-group',
          value   : { 
            key       : 1,
            subfield1 : 'Value first field of the field group', 
            subfield2 : {
              key             : 1, 
              nestedsubfield1 : 'Value first field of the nested field group',
              nestedsubfield2 : '',
              nestedsubfield3 : '',
              nestedsubfield4 : ''
            } 
          },
          fields  : [
            {
              label : 'Subfield 1',
              type  : 'hidden',
              name  : 'subfield1' 
            },
            {
              label   : 'Label',
              name    : 'subfield2',
              type    : 'field-group',
              fields  : [
                {
                  label     : 'Nested subfield 1',
                  type      : 'text',
                  name      : 'nestedsubfield1'
                },
                {
                  label     : '{{field-1}}',
                  type      : 'text',
                  name      : 'nestedsubfield2',
                  dependent : true
                },
                {
                  label     : '{{subfield1}}',
                  type      : 'text',
                  name      : 'nestedsubfield3',
                  dependent : true
                },
                {
                  label     : '{{nestedsubfield1}}',
                  type      : 'text',
                  name      : 'nestedsubfield4',
                  dependent : true
                }
              ]
            }
          ]
        }) }
      </>
    )

    const fieldGroups = document.getElementsByClassName('tf-field-group')
    expect(fieldGroups.length).toBe(2)

    const nestedFieldGroup = fieldGroups[1]

    const nestedFields = nestedFieldGroup.querySelectorAll('.tf-field-group-item') 
    expect(nestedFields.length).toBe(4)

    expect(within(nestedFields[0]).getByLabelText('Nested subfield 1')).toBeTruthy()
    expect(within(nestedFields[1]).getByLabelText('Value field 1')).toBeTruthy()
    expect(within(nestedFields[2]).getByLabelText('Value first field of the field group')).toBeTruthy()
    expect(within(nestedFields[3]).getByLabelText('Value first field of the nested field group')).toBeTruthy()
  })

  it('can use an object as a dependent value', () => {

    const { container } = render( 
      <>
        { fields.render({
          label   : 'Field group',
          name    : 'field-group',
          type    : 'field-group',
          value   : { 
            subfield1 : 'Subvalue1', 
            subfield2 : 'Subvalue2'
          },
          fields  : [
            {
              label : 'Subfield 1',
              type  : 'hidden',
              name  : 'subfield1' 
            },
            {
              label : 'Subfield 2',
              type  : 'hidden',
              name  : 'subfield2' 
            },
          ]
        }) }
        { fields.render({
          label       : '{{field-group.subfield1}}',
          description : '{{field-group.subfield2}}',
          type        : 'text',
          value       : 'Initial value of field 1',
          name        : 'field-1',
          dependent   : true
        }) }
      </>
    )

    const textFields = container.getElementsByClassName('tf-text')
    expect(textFields.length).toBe(1)

    expect(within(textFields[0]).getByLabelText('Subvalue1')).toBeTruthy()
    expect(within(textFields[0]).getByText('Subvalue2')).toBeTruthy()
  })
  
})
