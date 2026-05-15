import {useSearchFieldState} from 'react-stately';
import {useSearchField} from 'react-aria';
import { useRef } from 'react';
import { Button } from '../../base';

const SearchField = (props) => {
 let { label } = props;
 let state = useSearchFieldState( props );
 let ref = useRef( null );
 let { labelProps, inputProps, clearButtonProps } = useSearchField( props, state, ref );

  return (
    <div className='tf-search'>
      <label {...labelProps}>{label}</label>
      <div>
        <input {...inputProps} ref={ref} />
        {state.value !== '' &&
          <Button {...clearButtonProps}>X</Button>}
      </div>
    </div>
  )
}

export default SearchField
