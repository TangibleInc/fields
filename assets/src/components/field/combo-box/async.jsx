import { useAsyncList } from 'react-stately'
import { get } from '../../../requests'
import { getOptions } from '../../../utils'

const getAsyncProps = props => {

  /**
   * Async search
   * 
   * @see https://react-spectrum.adobe.com/react-aria/useComboBox.html#asynchronous-loading
   */
  const list = useAsyncList({
    async load({ filterText }) {
    
      const data = {
        ...(props.asyncArgs ?? {}),
        search: filterText
      }

      /**
       * We support 2 ways to get async result, either by fetching a given url or by
       * using our internal ajax module. If props.ajaxAction is defined, it means we rely 
       * on our internal module
       * 
       * @see https://docs.tangible.one/modules/plugin-framework/ajax/
       */
      const results = props.ajaxAction
        ? await Tangible?.ajax(props.ajaxAction, data)
        : await get(props.searchUrl ?? '', data) 
      
      return {
        items: getOptions(
          (results ?? []).reduce((items, item) => ({ ...items, [item.id]: item.title }), {})
        )
      }
    }
  })

  return {
    items: list.items,
    inputValue: list.filterText,
    onInputChange: list.setFilterText,
  }
}

export {
  getAsyncProps
}
