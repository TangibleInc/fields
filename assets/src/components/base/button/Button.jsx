import { 
  useRef,
  forwardRef 
} from 'react'

import { 
  useButton,
  VisuallyHidden
} from 'react-aria'

import PropTypes from 'prop-types';

import { triggerEvent } from '../../../events'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useButton.html
 */

const Button = forwardRef(({ 
  children,
  ...props 
}, ref) => {

  /**
   * Use new ref if no ref forwarded
   */
  const _ref = useRef()
  const buttonRef = ref ?? _ref

  // Some props names are going to be different when generated from PHP
  const content = props.content ?? children
  const buttonType = props.buttonType ?? 'button'
  const type = props.layout 
    ? (props.layout ? `tf-button-${props.layout}` : '')
    : (props.type ? `tf-button-${props.type}` : '')

  const { buttonProps } = useButton(props, ref)

  const context = props.context ? `tf-button-is-${props.context}` : ''
  const classes = `${type} ${context} ${props.className ?? ''}`
  
  const CustomTag = props.changeTag && props.changeTag == 'span' ? 'span' : 'button'
  
  return (
    <CustomTag 
      className={ classes } 
      style={ props.style } 
      { ...buttonProps }
      onClick={ event => {
        buttonProps.onClick(event)
        triggerEvent('buttonPressed', {
          name  : props.name ?? false,
          props : props,
          event : event,
        })
      }}
      ref={ buttonRef } 
      type={ buttonType }
    >
      { props.contentVisuallyHidden
        ? <VisuallyHidden>{ content }</VisuallyHidden>
        : content }
    </CustomTag>
  )
})

Button.propTypes = {
  /** Usage context for styling */
  context: PropTypes.oneOf(['default', 'wp', 'elementor', 'beaver-builder']),
  /** Which layout should the button use? */
  layout: PropTypes.oneOf(['action', 'danger', 'primary', 'text-action', 'text-danger', 'text-primary']),
  /** Button contents */
  content: PropTypes.string,
  /** Additional class names */
  className: PropTypes.string,
  /** Inline styles */
  style: PropTypes.object,
  /** Button name */
  name: PropTypes.string,
  /** Change the tag used to render the button */
  changeTag: PropTypes.oneOf(['button', 'span']),
  /** Visually hidden content */
  contentVisuallyHidden: PropTypes.bool,
  /** Button type attribute */
  buttonType: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Children nodes */
  children: PropTypes.node,
};

Button.defaultProps = {
  context: 'default',
  layout: 'action',
  buttonType: 'button',
};

export default Button
