import { initExample } from './register-custom-type'

/**
 * Settings page: Change context on select change
 */
window.addEventListener('load', () => {
            
  const select = document.getElementById('tf-context-select')
  
  select.addEventListener('change', () => {

    const url = new URL(location.href);
    const params = new URLSearchParams(url.search)
    
    params.set('context', select.value)

    location.replace(location.protocol + '//' + location.host + location.pathname + '?' + params.toString())
  })

  /**
   * Example for custom field type registration
   */
  if( document.getElementById('tf-example-custom-types') ) initExample()

  /**
   * Specific to dynamic value list page - Handle list selection
   */
  const trigger = document.getElementsByClassName('tf-dynamic-value-trigger-js')
  const content = document.getElementsByClassName('tf-dynamic-value-content-js')

  if( trigger.length === 0 ) return;

  for (let i = 0; i < trigger.length; i++) {
    trigger[i].addEventListener('click', () => {
      jQuery('.tf-dynamic-value-content-js').attr('style', 'display: none')
      content[i].setAttribute('style', '')
    })
  }
})
