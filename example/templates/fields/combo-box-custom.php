<h4>Example using custom component for render (JS only)</h4>

It's possible to use a custom react component to render a combobox field.

Here is an example with the associated code:

<div class="tangible-settings-code-preview">

  <div class="tangible-settings-code-preview-field" style="width: 50%">
    <div id="tf-example-custom-combobox-layout" class="tangible-settings-row">
    </div>
  </div>

  <div class="tangible-settings-code-preview-code" style="width: 50%">
    <?php $this->start_code('javascript') ?>
import {
  createRoot,
  forwardRef
} from 'react'

const container = document.getElementById('container')
const Field = props => tangibleFields.render(props)

const CustomSearch = forwardRef((props, ref) => {
  
  const {
    add,
    remove,
    values
  } = props.multiple

  return(
    <>
      <code style={{ 
        display       : 'flex', 
        width         : '100%',
        padding       : 5,
        boxSizing     : 'border-box',
        flexDirection : 'column'
      }}>
        { values.length !== 0
          ? <>
              Selected values are:<br />
              <ul>{ values.map( value => <li key={ value.key }> - { value } </li> ) }</ul>
            </>
          : 'No value selected' }  
      </code>
      <input 
        type="text"
        style={{ 
          display: 'flex',
          width: '100%'
        }}
        { ...props.inputProps } 
        ref={ ref.current.input }
      />
      <ul>
        { [...props.state.collection].map(item => (
          <li 
            key={ item.key } 
            style={{ 
              display : 'flex',
              border  : 'solid 1px black',
              padding : 5
            }}
          >
            <Field
              type={ 'checkbox' }
              label={ item.textValue }
              labelVisuallyHidden={ true }
              value={ values.includes(item.key) }
              onChange={ value => {
                if( value === values[ item.key ] ) return; 
                value === true
                  ? add( item.key )
                  : remove( values.indexOf( item.key ) ) 
              }}
            />
            { item.textValue }
          </li>
        )) }
        { props.state.collection.iterable.length === 0 &&
          <li key="no-results">No results</li> }
      </ul>
    </>
  )
})

createRoot(container)
  .render(
    tangibleFields.render({
      label     : 'Custom combobox', 
      type      :'combo-box',
      name      :'custom-combo-box-example',
      value     : '',
      multiple  : true,
      onChange  : value => console.log(value),
      layout    : CustomSearch,
      choices   : {
        value1    : 'Example value 1',
        value2    : 'Second example value',
        value3    : 'An example: third part',
        value4    : 'The last example (4)'
      },
    })
  )
    <?php $this->end_code() ?>
  </div>
  
</div>
