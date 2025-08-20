import { triggerEvent } from './events'

export default {
  rerender: name => triggerEvent('_fieldRerender', name),
  /**
   * Used to register dependent callbacks when field hasn't been created in JavaScript
   * directly
   *
   * @see getFieldValue() in ./components/dependent/utils.php
   */
  dependent: {
    __callbacks: {},
    registerCallback(name, callback) {
      this.__callbacks[ name ] = callback
    }
  },
  repeater: {
    __callbacks: {},
    registerCallback(name, callback) {
      this.__callbacks[ name ] = callback
    }
  }
}
