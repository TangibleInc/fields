import { isDependentString } from '../../dependent/utils'

/**
 * In order to support dependent value from the repeater, we have
 * to render the title as an element so that it's wrapped inside
 * a new dependent wrapper that can access repeater values
 */
const renderTitle = (item, i, title, name, renderItem, parent) => {

  const text = title ? title : ('Item ' + (i + 1))

  if( ! isDependentString(text) ) return text;

  const element = {
    type      : 'wrapper',
    name      : `_repeater-title-${name}-${item.key}`,
    content   : title,
    dependent : {
      callbackData: {
        repeater: {
          props : parent,
          item  : item,
          index : i
        }
      },
      ...(parent.dependent ? parent.dependent : {})
    }
  }

  return renderItem(element, item, i)
}

export { renderTitle }
