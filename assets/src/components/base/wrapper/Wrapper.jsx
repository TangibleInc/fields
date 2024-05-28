/**
 * Empty base element, that is used to render other compoenent wrapper into
 * the Element componenet, so that dependent values or visibility conditions
 * will applied
 * 
 * @see see .assets/src/Element.jsx 
 */
const Wrapper = ({ 
  content,
  children,
}) => <>{ content ?? children }</>

export default Wrapper
