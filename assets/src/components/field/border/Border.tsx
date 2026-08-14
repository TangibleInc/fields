import { useEffect, useState } from 'react'
import { Field } from '@tangible/ui'
import { initJSON } from '../../../utils'

import Dimensions from '../dimensions/Dimensions'
import { Color } from '../'

/**
 * border = dimensions + a color — { dimensions, color }, JSON in the hidden
 * input. The dimensions half is the now-TUI Dimensions composite; the color
 * half is still the react-aria Color field (TUI has no ColorPicker yet — see
 * the ColorPicker gap). Wrapper migrated to the TUI Field idiom.
 */
const Border = (props: any) => {
  const units: string[] = props.units ?? ['px']
  const format = props.format ?? 'hex'

  const [value, setValue] = useState<any>(() =>
    initJSON(props.value ?? '', {
      dimensions: { top: 0, left: 0, right: 0, bottom: 0, unit: units[0], isLinked: false },
      color: 'rgba(0,0,0,1)',
    })
  )

  useEffect(() => {
    props.onChange && props.onChange(value)
  }, [value])

  // Dimensions sends an object (partial dimensions); Color sends a string.
  const handleData = (next: any) => {
    if (typeof next === 'string') {
      setValue((prev: any) => ({ ...prev, color: next }))
    } else {
      setValue((prev: any) => ({ ...prev, dimensions: { ...prev.dimensions, ...next } }))
    }
  }

  const disabled = Boolean(props.readOnly)

  return (
    <div className="tf-border">
      <input type="hidden" name={props.name ?? ''} value={JSON.stringify(value)} />
      <Field className={props.className} disabled={disabled} error={Boolean(props.isInvalid)}>
        {props.label && (
          <Field.Label hidden={Boolean(props.labelVisuallyHidden)}>{props.label}</Field.Label>
        )}
        <Field.Control>
          <div role="group" className="tf-border-container">
            <div className="tf-border-dimensions-container">
              <Dimensions
                label="Border dimensions"
                labelVisuallyHidden
                onChange={handleData}
                linked={props.linked}
                units={units}
                value={value.dimensions}
                readOnly={props.readOnly}
                min={0}
              />
            </div>
            <div className="tf-border-color-picker-container">
              <Color
                label="Border Color"
                labelVisuallyHidden
                onChange={handleData}
                value={value.color}
                format={format}
                hasAlpha={props.hasAlpha ?? true}
              />
            </div>
          </div>
        </Field.Control>
        {props.description && (
          <Field.HelperText
            className={props.descriptionVisuallyHidden ? 'tui-visually-hidden' : undefined}
          >
            {props.description}
          </Field.HelperText>
        )}
      </Field>
    </div>
  )
}

export default Border
