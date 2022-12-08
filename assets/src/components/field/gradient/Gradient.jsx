import {
  useEffect, 
  useState,
  useRef
} from 'react'

import { 
  Description,
  Label,
  Popover
} from '../../base'

import { 
  useField,
  FocusScope
} from 'react-aria'

import { Item } from 'react-stately'

import ColorPicker from '../color/ColorPicker'
import Select from '../select/Select'
import Number from '../number/Number'

const Gradient = props => {

  const [editColor, setEditColor] = useState(false)
  const [open, isOpen] = useState(false)

  const [value, setValue] = useState( 
    props.value && props.value !== '' 
      ? (typeof props.value !== 'object' 
        ? JSON.parse(props.value) 
        : props.value)
      : {
        type: 'linear',
        angle: 45,
        shape: 'ellipse',
        colors: [
          'rgba(0,255,255,1)',
          'rgba(0,255,255,1)' 
        ]
      } 
  )

  const input = useRef()
  const gradientPopover = useRef()
  const colorPopover = useRef()
  
  const { 
    labelProps, 
    fieldProps, 
    descriptionProps 
  } = useField(props)

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }

  /**
   * Support only 2 colors for now, but a gradient can have more
   */
  const generateGradient = () => {
    switch(value.type) {
      case 'linear':
        return `linear-gradient(${value.angle}deg, ${value.colors[0]} 0%, ${value.colors[1]} 100%)`
      case 'radial':
        return `radial-gradient(${value.shape}, ${value.colors[0]} 0%, ${value.colors[1]} 100%)`
      case 'conic':
        return `conic-gradient(${value.colors[0]} 0%, ${value.colors[1]} 100%)`
    }
  }

  /**
   * We can't use useFocusWithin because it's not working well when nested (the ColorPicker
   * component already implment it)
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useFocusWithin.html
   * @see https://stackoverflow.com/a/42234988/10491705
   */
  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [gradientPopover])
  
  const onClickOutside = event => {

    const ref = gradientPopover.current ?? false
    
    if( ! ref ) return;
    if( ref.contains(event.target) ) return;
    
    isOpen(false)
  }

  const updateColor = (i, color) => {
    const newColors = [ ...value.colors ]
    newColors[i] = color?.toString('rgba')
    updateValue('colors', newColors)
  }

  const updateValue = (key, attribute) => {
    setValue({ 
      ...value,
      [key]: attribute
    })
  }

  return(
    <div class="tf-gradient">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-gradient-container">
        <input 
          type="text" 
          class="tf-gradient-input" 
          value={ generateGradient() } 
          onClick={ e => isOpen(true) }
        />
        <input 
          type="hidden"
          ref={ input }
          value={ JSON.stringify(value) } 
          name={ props.name ?? '' }
          { ...fieldProps } 
        />
        { open && 
          <Popover ref={ gradientPopover }>
            <FocusScope autoFocus>
              <div class="tf-gradient-popover">
                <div class="tf-gradient-preview" style={{ 
                  background: generateGradient()  
                }}>
                  <div class="tf-gradient-colors">
                    { value.colors?.map((color, i) => (
                      <div 
                        class="tf-gradient-color tf-color-area-thumb"
                        style={{ background: value.colors[i] }} 
                        onClick={ () => setEditColor(i) }
                      />
                    )) }
                  </div>
                  { editColor !== false && 
                    <Popover ref={ colorPopover }>
                      <ColorPicker 
                        value={ value.colors[editColor] }
                        onChange={ color => updateColor(editColor, color) }
                        hasAlpha={ true } 
                        onFocusChange={ isFocus => isFocus === false ? setEditColor(false) : false }
                      />
                  </Popover> }
                </div>
                <div class="tf-gradient-settings">
                  <div class="tf-gradient-settings-row">
                    <Select
                      label={ 'Gradient type' } 
                      selectedKey={ value.type ?? 'linear' } 
                      onSelectionChange={ type => updateValue('type', type) }
                    >
                      <Item key="linear">Linear</Item>
                      <Item key="radial">Radial</Item>
                      <Item key="conic">Conic</Item>
                    </Select>
                  </div>
                  <div>
                    { value.type === 'linear' &&
                      <div class="tf-gradient-settings-row">
                        <Number
                          label={ 'Angle' }
                          value={ value.angle ?? 45 }
                          onChange={ angle => updateValue('angle', angle) }
                        /> 
                      </div> }
                    { value.type === 'radial' &&
                      <div class="tf-gradient-settings-row">
                        <Select 
                          label={ 'Shape' }
                          selectedKey={ value.shape ?? 'ellipse' } 
                          onSelectionChange={ shape => updateValue('shape', shape) }
                        >
                          <Item key="circle">Circle</Item>
                          <Item key="ellipse">Ellispe</Item>
                        </Select> 
                      </div> }
                  </div> 
                </div> 
              </div>  
            </FocusScope>
          </Popover>  }
      </div>      
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Gradient
