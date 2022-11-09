import { render } from 'react-dom'
import { OverlayProvider } from 'react-aria'

import Control from './Control'

window.addEventListener('load', () => {

  const { TangibleFields: fields } = window

  for( const field in fields ) {

    const props = fields[ field ]
    const element = document.getElementById(props.element)

    if( ! element ) continue;

    render(
      <OverlayProvider>
        <Control name={ field } { ...props } />
      </OverlayProvider>
    , element)
  }

})

