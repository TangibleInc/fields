import { 
  useState,
  useRef
} from 'react'

import { useField } from 'react-aria'
import { ComboBox } from '..'
import { initJSON } from '../../../utils'

import { 
  Label, 
  Description,
  Button
} from '../../base'

const List = props => {

  const emptyItem = { 
    value: '', 
    _canDelete: true ,
    _enabled: true 
  }

  const [items, setItems] = useState(
    initJSON( props.value ?? '[]', [] )
  )

  const [selected, setSelected] = useState('')
  const refresh = useRef(0)
  const { 
    labelProps, 
    fieldProps,
    descriptionProps 
  } = useField(props)

  const addSelectedItem = () => {
    setItems([ 
      ...items, 
      { 
        ...emptyItem, 
        value : selected 
      } 
    ])
    setSelected('')
    refresh.current = refresh.current + 1 // Simplest way to refresh the inputValue
  }

  const removeItem = i => {
    setItems([
      ...items.slice(0, i), 
      ...items.slice(i + 1)
    ])
  }

  const updateItem = (i, name, value) => {
    setTimeout(() => {
      setItems([
        ...items.slice(0, i),
        { ...items[i], [name]: value },
        ...items.slice(i + 1)
      ])
    })

  }

  const getItemText = item => (
    ! props.isAsync
      ? (props.choices[ item ] ?? item)
      : item.label
  )

  return(
    <div className="tf-list">
      <input type="hidden" value={ JSON.stringify(items) } { ...fieldProps } />
      <div className="tf-list-container">
        <div className="tf-list-items">
          <div className="tf-list-header">
            { props.label &&
              <Label labelProps={ labelProps } parent={ props }>
                { props.label }
              </Label> }
            <div className="tf-list-header-actions">
            </div>
          </div>
          <div className="tf-list-items">
          { items.map((item, i) => (
            <div key={ item.value } className="tf-list-item">
              <div className="tf-list-item-text">
                { getItemText(item.value) }
              </div>
              <div key={ item } className="tf-list-item-actions">
                { item._canDelete && 
                  <Button 
                    type="icon-trash" 
                    onPress={ () => removeItem(i) } 
                  /> }
                <Button 
                  type="icon-eye" 
                  onPress={ () => updateItem(i, '_enabled', ! item._enabled  ) } 
                  style={ ! item._enabled 
                    ? { opacity: 0.5, filter: 'grayscale(60%)' } 
                    : {} } 
                />
              </div>
            </div>
          )) }
          </div>
        </div>
        <div className='tf-list-search'>
          <ComboBox 
            { ...props }
            key={ refresh.current } 
            value={ selected }
            description={ false }
            labelVisuallyHidden={ true }
            disabledKeys={ items.map(item => item.value) }
            multiple={ false }
            onChange={ item => {
              if( ! item ) return;
              setSelected( item )
            }}
          />
          <Button 
            type="action" 
            onPress={ addSelectedItem } 
            isDisabled={ selected === '' }
          >
            Add
          </Button>
        </div>
      </div>
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default List
