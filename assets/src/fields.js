import { triggerEvent } from './events'

export default {
  rerender: name => triggerEvent('_fieldRerender', name)
}
