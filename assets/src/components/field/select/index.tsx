import Single from './Single'
import Multiple from './Multiple'

/**
 * select entry. Routes to the single- or multi-select TUI wrapper.
 *
 * Value contract (unchanged from the react-aria implementation):
 *  - single:   value (string)          hidden: value
 *  - multiple: onChange([...keys])     hidden: "a,b,c"
 *
 * @see control-list.js (PHP side reads the hidden input)
 */
export default (props: any) => (props.multiple ? <Multiple {...props} /> : <Single {...props} />)
