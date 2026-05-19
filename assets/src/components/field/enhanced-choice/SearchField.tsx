import {useSearchFieldState} from 'react-stately';
import {useSearchField} from 'react-aria';
import { Button } from '../../base';

const SearchField = (props) => {
 let { label } = props;
 let state = useSearchFieldState( props );
//  let ref = useRef( null );
 let { labelProps, inputProps, clearButtonProps } = useSearchField( props, state, props.inputRef );

  return (
    <div className='tf-search'>
      <label {...labelProps}>{label}</label>
      <div>
        <input {...inputProps} ref={props.inputRef} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
        { state.value !== '' &&
          <Button {...clearButtonProps}>X</Button> }
        { state.value === '' &&
          <Button
            type="action"
            onPress={ () => props.setIsOpen(!props.isOpen) }
            className="tf-enhanced-choice-toggle-btn"
          >
            <span aria-hidden="true">{ props.isOpen ? '▲' : '▼' }</span>
          </Button>
        }
      </div>
    </div>
  )
}

export default SearchField
