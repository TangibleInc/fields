import {
  useState,
  useEffect,
  createRoot
} from 'react'

const initExample = () => {

  const container = document.getElementById('tf-example-custom-types')
  const value = container.getAttribute('data-value')

  const MyCustomField = props => {

    const { initJSON } = tangibleFields.utils
    const [value, setValue] = useState( initJSON(props.value ?? {}) )

    useEffect(() => {
      if( props.onChange ) props.onChange(value)
    }, [value])

    return(
      <div className="tf-custom-type" style={{ display: 'flex' }}>
        <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
        <div>
          <strong>Character attributes:</strong>
          <hr /> 
          { tangibleFields.render({
            label     : 'First name',
            type      :'text',
            value     : value.firstName ?? '',
            onChange  : firstName => setValue({ ...value, firstName: firstName }),
          }) }
          { tangibleFields.render({
            label     : 'Last name',
            type      :'text',
            value     : value.lastName,
            onChange  : lastName => setValue({ ...value, lastName: lastName }),
          }) }
          <hr />
          { tangibleFields.render({
            label     : 'Avatar',
            type      : 'file',
            maxUpload : 1,
            wp_media  : false,
            value     : value.avatar ?? '',
            onChange  : avatar => setValue({ ...value, avatar: avatar }),
            mimeTypes : [ 'image' ]
          }) }
        </div>
      </div>
    )
  }

  tangibleFields.types.add('custom-type', MyCustomField)

  createRoot(container)
    .render(
      tangibleFields.render({
      'type'  :'custom-type',
      'name'  :'custom-field-example',
      'value' : value
      }
    ))
}

export { initExample }
