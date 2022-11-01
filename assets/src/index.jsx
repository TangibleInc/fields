import { render } from 'react-dom'
import { Provider } from '@react-spectrum/provider'
import { theme } from '@react-spectrum/theme-light'

import Control from './Control'

window.addEventListener('load', () => {

  const { TangibleFields: fields } = window

  for( const field in fields ) {

    const props = fields[ field ]
    const element = document.getElementById(props.element)

    if( ! element ) continue;

    render(
      <Provider theme={ theme } colorScheme={ 'light' }>
        <Control name={ field } { ...props } />
      </Provider>
    , element)
  }

})

