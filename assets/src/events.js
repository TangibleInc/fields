const prefix = 'tangible/fields/'

const triggerEvent = (name, args = {}) => {

  const event = new CustomEvent(prefix + name, { detail: args })

  window.dispatchEvent(event)
}

const addEventListener = (name, callback) => {

  const eventCallback = event => callback(event.detail ?? {}, event) 
  
  window.addEventListener(prefix + name, eventCallback)

  return eventCallback
}

const removeEventListener = (name, callback) => (
  window.removeEventListener(prefix + name, callback)
)

export {
  triggerEvent,
  addEventListener,
  removeEventListener
}
