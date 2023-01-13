import { render } from 'react-dom'
import { OverlayProvider } from 'react-aria'

import Control from './Control'

const tangibleFields = props => (
  <OverlayProvider>
    <Control { ...props } />
  </OverlayProvider> 
)

/**
 * Render fields registered from PHP
 */
window.addEventListener('load', () => {

  const { fields } = TangibleFields

  for( const field in fields ) {

    const props = fields[ field ]
    const element = document.getElementById(props.element)

    if( ! element ) continue;

    render(
      tangibleFields({ 
        name: field, 
        ...props 
      })
    , element)
  }

})

/**
 * Make tangibleFields accessible from other scripts
 */
window.tangibleFields = tangibleFields
