import { useCallback, useMemo, useRef, useState } from 'react'
import { get } from '../../../requests'
import { getOptions } from '../../../utils'

/**
 * Option shapes produced by getOptions():
 *  - flat:    { value, label }
 *  - grouped: { key, label, choices: [{ value, label }] }
 */
export type ComboboxOption = {
  value: string | number
  label: string
  key?: string
  choices?: ComboboxOption[]
}

const NO_RESULTS = '_noResults'

/**
 * Data source for the TUI combo-box wrappers. Replaces the react-stately
 * useAsyncList integration. Two modes, selected by props.isAsync:
 *
 *  - static: options come from props.choices and are filtered client-side by
 *    the current query (contains, case-insensitive).
 *  - async:  options come from a debounced fetch (props.ajaxAction via the
 *    Tangible ajax module, or props.searchUrl via the requests helper),
 *    optionally reshaped by props.mapResults.
 *
 * Returns the current option list, a loading flag, an onInputChange handler to
 * wire to the TUI combobox, and ensureLoaded() to kick the first async fetch
 * when the listbox opens.
 */
export function useComboboxData(props: any) {
  const isAsync = Boolean(props.isAsync)

  const [query, setQuery] = useState('')
  const [asyncItems, setAsyncItems] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstLoadRef = useRef(true)

  // Static options (flat or grouped) from choices
  const staticOptions = useMemo<ComboboxOption[]>(
    () => getOptions(props.choices ?? {}),
    [props.choices]
  )

  const runFetch = useCallback(
    async (q: string) => {
      setLoading(true)
      const data = { ...(props.asyncArgs ?? {}), search: q }

      // Two transports: internal Tangible ajax module (ajaxAction) or a URL
      // (searchUrl). Mirrors the previous async.tsx behaviour.
      let results = props.ajaxAction
        ? await (window as any).Tangible?.ajax(props.ajaxAction, data)
        : await get(props.searchUrl ?? '', data)

      // A non-array object response (e.g. PHP array with non-consecutive keys
      // encoded as an object) is coerced to its values.
      if (!Array.isArray(results) && typeof results === 'object' && results !== null) {
        results = Object.values(results)
      }

      const shaped = props.mapResults ? mapResults(results, props.mapResults) : results
      const items: ComboboxOption[] = (shaped ?? []).map((item: any) => ({
        value: item.id,
        label: item.title,
      }))

      setAsyncItems(items)
      setLoading(false)
    },
    [props.ajaxAction, props.searchUrl, props.asyncArgs, props.mapResults]
  )

  const onInputChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (!isAsync) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => runFetch(value), props.debounceTime ?? 200)
    },
    [isAsync, runFetch, props.debounceTime]
  )

  // Kick the first async load when the listbox opens (no query yet).
  const ensureLoaded = useCallback(() => {
    if (isAsync && firstLoadRef.current) {
      firstLoadRef.current = false
      runFetch('')
    }
  }, [isAsync, runFetch])

  // Effective option list. Async is server-filtered; static filters here.
  const options = useMemo<ComboboxOption[]>(() => {
    if (isAsync) return asyncItems
    const q = query.trim().toLowerCase()
    if (!q) return staticOptions
    // Filter flat options and group contents; drop empty groups.
    return staticOptions
      .map((opt) =>
        opt.choices
          ? { ...opt, choices: opt.choices.filter((c) => label(c).includes(q)) }
          : opt
      )
      .filter((opt) => (opt.choices ? opt.choices.length > 0 : label(opt).includes(q)))
  }, [isAsync, asyncItems, staticOptions, query])

  return { options, loading, isAsync, query, onInputChange, ensureLoaded, NO_RESULTS }
}

const label = (opt: ComboboxOption) => String(opt.label ?? '').toLowerCase()

/**
 * Reshape API results to the expected { id, title } via a mapResults config.
 * Ported from async.tsx.
 */
function mapResults(results: any[], config: any) {
  return results.map((item) => {
    if (config.id) item.id = mapResultsItem(item, config.id)
    if (config.title) item.title = mapResultsItem(item, config.title)
    return item
  })
}

function mapResultsItem(item: any, config: any) {
  return typeof config === 'object' ? item[config.key][config.attribute] : item[config]
}
