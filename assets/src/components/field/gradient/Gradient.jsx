import {
  useEffect, 
  useState,
  useRef
} from 'react'

import { 
  Description,
  Label,
  Dialog,
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

  useEffect(() => {
    props.onChange && props.onChange({
      ...value,
      stringValue: generateGradient()
    })
  }, [value])

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
    <div className="tf-gradient">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div className="tf-gradient-container">
        <input 
          ref={gradientPopover}
          type="text" 
          className="tf-gradient-input"
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
          <Popover
            state={{ isOpen: open, close: () => isOpen(false) }}
            triggerRef={gradientPopover}
            placement="bottom start"
          >
            <Dialog>
              <FocusScope autoFocus>
                <div className="tf-gradient-popover">
                  <div className="tf-gradient-preview" ref={colorPopover} style={{
                    background: generateGradient()  
                  }}>
                    <div className="tf-gradient-colors">
                      { value.colors?.map((color, i) => (
                        <div 
                          className="tf-gradient-color tf-color-area-thumb"
                          style={{ background: value.colors[i] }} 
                          onClick={ () => setEditColor(i) }
                        />
                      )) }
                    </div>
                  </div>
                  <div className="tf-gradient-settings">
                    <div className="tf-gradient-settings-row">
                      <Select
                        label={ 'Gradient type' } 
                        selectedKey={ value.type ?? 'linear' } 
                        onSelectionChange={ type => updateValue('type', type) }
                      >
                        <Item key="linear">Linear</Item>
                        <Item key="radial">Radial</Item>
                        <Item key="conic">Conical</Item>
                      </Select>
                    </div>
                    <div>
                      { value.type === 'linear' &&
                        <div className="tf-gradient-settings-row">
                          <Number
                            label={ 'Angle' }
                            value={ value.angle ?? 45 }
                            onChange={ angle => updateValue('angle', angle) }
                          /> 
                        </div> }
                      { value.type === 'radial' &&
                        <div className="tf-gradient-settings-row">
                          <Select 
                            label={ 'Shape' }
                            selectedKey={ value.shape ?? 'ellipse' } 
                            onSelectionChange={ shape => updateValue('shape', shape) }
                          >
                            <Item key="circle">Circle</Item>
                            <Item key="ellipse">Ellipse</Item>
                          </Select> 
                        </div> }
                    </div> 
                  </div> 
                </div>  
              </FocusScope>
            </Dialog>
          </Popover>  }

          {editColor !== false && (
            <Popover
              state={{ isOpen: editColor !== false, close: () => setEditColor(false) }}
              triggerRef={colorPopover} 
              placement="bottom"
            >
              <ColorPicker
                value={value.colors[editColor]}
                onChange={(color) => updateColor(editColor, color)}
                hasAlpha={true}
                onFocusChange={(isFocus) =>
                  isFocus === false ? setEditColor(false) : false
                }
              />
            </Popover>
          )}

      </div>      
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Gradient
