import * as tangibleFields from './index.jsx'

window.tangibleFields = tangibleFields
window.addEventListener('load', () => {
  if (window.TangibleFieldsConfig) {
    tangibleFields.setConfig(window.TangibleFieldsConfig)
  }
  tangibleFields.init()
})
