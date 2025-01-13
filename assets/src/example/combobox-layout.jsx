import {
  createRoot,
  forwardRef
} from 'react'

const initCombobox = () => {
 
  const container = document.getElementById('tf-example-custom-combobox-layout')
  const Field = props => tangibleFields.render(props)

  const CustomSearch = forwardRef((props, ref) => {
    
    if ( ! props.multiple ) {
      throw new Error( 'This layout only support multiple values' )
    }
    
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
}

export { initCombobox }
