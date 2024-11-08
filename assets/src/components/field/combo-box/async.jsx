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
      let results = props.ajaxAction
        ? await Tangible?.ajax(props.ajaxAction, data)
        : await get(props.searchUrl ?? '', data)

      if ( results.length === 0 ) {
        results.push({
          id    : '_noResults',
          title : 'No results'
        })
      }

      /**
       * If response is an object, we attempt to use it anyway
       *
       * That can be usefull if value on the php side was an array with no consecutive numbers
       * as it will be encoded as an json object
       */
      if ( ! Array.isArray(results) && typeof results === 'object' ) {
        results = Object.values(results).map(item => item)
      }

      const formatedResults = props.mapResults
        ? mapResults(results, props.mapResults)
        : results

      return {
        items: getOptions(
          (formatedResults ?? []).reduce((items, item) => ({ ...items, [item.id]: item.title }), {})
        )
      }
    }
  })

  return {
    items         : list.items,
    inputValue    : list.filterText,
    onInputChange : list.setFilterText,
    selectedKeys  : props.value.value ?? '',
    loadingState  : list.loadingState
  }
}

/**
 * We expect the response to be a list of object, and will use the id and title attribute
 * as the list value/name
 *
 * Some endpoint will retrurn a different structure so we use the mapResults parameter to convert
 * those response to the expected format
 */
const mapResults = (results, mapResults) => (
  results.map(item => {

    if( mapResults.id ) {
      item.id = mapResultsItem(item, mapResults.id)
    }

    if( mapResults.title ) {
      item.title = mapResultsItem(item, mapResults.title)
    }

    return item
  })
)

/**
 * TODO: support nested objects
 */
const mapResultsItem = (item, config) => (
  typeof config === 'object'
    ? item[ config.key ][ config.attribute ]
    : item[ config ]
)

export {
  getAsyncProps
}
