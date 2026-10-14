import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, Element, event } from '../../../assets/src/index'
import { column, output, parameters, decorators } from './shared'

const meta = {
  title: 'JavaScript API/Events',
  component: Field,
  decorators,
  parameters
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * valueChange and buttonPressed events, logged as they happen
 */
export const Listen: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([])
    const add = line => setLog(current => [line, ...current].slice(0, 6))

    useEffect(() => {
      const onValueChange = event('valueChange', field => {
        if (field.name !== 'events-field') return
        add(`valueChange: ${JSON.stringify(field.value)} (was ${JSON.stringify(field.previousValue)})`)
      })
      const onButtonPressed = event('buttonPressed', button => {
        if (button.name !== 'events-button') return
        add('buttonPressed')
      })
      return () => {
        window.removeEventListener('tangible/fields/valueChange', onValueChange)
        window.removeEventListener('tangible/fields/buttonPressed', onButtonPressed)
      }
    }, [])

    return (
      <div style={ column }>
        <Field type="text" name="events-field" label="Text" />
        <Element type="button" name="events-button" layout="action" content="Button" />
        <pre style={ output }>{ log.length ? log.join('\n') : 'No event yet' }</pre>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `tangibleFields.event('valueChange', field => {
  if (field.name !== 'events-field') return
  console.log(field.value, field.previousValue)
})

tangibleFields.event('buttonPressed', button => {
  if (button.name !== 'events-button') return
  console.log('pressed')
})`
      }
    }
  }
}
