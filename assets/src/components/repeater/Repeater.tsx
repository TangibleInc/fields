import {
  useEffect,
  useReducer,
  useState,
  useRef
} from 'react'

import {
  repeaterDispatcher,
  initDispatcher
} from './dispatcher.ts'

import { MoveHandle } from '@tangible/ui'

import {
  Button,
  Title,
  ConfirmTrigger
} from '../base'

import types from '../../types.ts'
import Item from './common/Item'
import strings from './strings.ts'

const Repeater = props => {

  const fields = props.fields ?? []
  const layout = props.layout && Object.keys(types._types.repeater).includes( props.layout )
    ? props.layout
    : 'table'
  const Layout = types.get(layout, 'repeater')

  const repeatable = props.repeatable ?? true
  const maxLength = props.maxlength ?? Infinity

  /**
   * Opt-in row reordering (PHP: sortable). Rows get a MoveHandle in place of
   * the plain index, with up/down moves; the saved value follows the order
   */
  const sortable = repeatable && Boolean(props.sortable) && props.sortable !== 'false'
  const [announcement, setAnnouncement] = useState('')

  const rowFields = fields.map(field => {

    const rowField = Object.assign({}, field)

    /**
     * Label/description sometimes not visibile dependeing of the layout,
     * but still needs to be set for accesibility
     */
    if( layout === 'table' ) {
      rowField.labelVisuallyHidden = true
      rowField.descriptionVisuallyHidden = true
    }
    else if( layout === 'tab' ) {
      rowField.labelVisuallyHidden = true
    }

    delete rowField.value
    delete rowField.onChange

    return rowField
  })

  const emptyItem = {}
  fields.forEach(field => {
    emptyItem[ field.name ] = props.newItem
      ? (props.newItem[ field.name ] ?? '')
      : ''
  })

  const [items, dispatch] = useReducer(
    repeaterDispatcher(emptyItem, maxLength, props),
    props.value ?? '',
    value => initDispatcher(value, emptyItem)
  )

  const hasField = name => (
    rowFields.map(
      field => field.name ?? false
    ).includes(name)
  )

  /**
   * Can be used by repeater sub-controls to watch value change from the current row/block
   */
  const [onChangeCallback, setChangeCallback] = useState([])

  /**
   * Call all the visibility callback attached to data.watcher (@see <Control /> below)
   */
  const triggerRowCallbackEvents = (rowKey, fieldName) => {
    onChangeCallback.forEach(callback => callback(rowKey, fieldName))
  }

  /**
   * Not sure why, but without a ref the state value is always empty when used inside getValue()
   */
  const values = useRef()
  values.current = items

  const rootRef = useRef<HTMLDivElement>(null)

  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  /**
   * The confirm dialog restores focus to its trigger on close, but removing a
   * row destroys that trigger with it. Hand focus to the row now occupying the
   * removed position (its toggle when the layout has one, else its first
   * control), or to the footer actions once the list is empty. Deferred so it
   * lands after TUI's own restore attempt
   */
  /**
   * Reorder and keep focus on the control that did it: the row moves in the
   * DOM, and TUI's MoveHandle recovers to the opposite arrow at a boundary
   */
  const move = (from: number, to: number) => {
    const count = items.length
    if (to < 0 || to >= count) return
    dispatch({ type: 'move', from, to })
    setAnnouncement(string('movedAnnouncement', { index: from + 1, position: to + 1, count }))
    const direction = to > from ? 'down' : 'up'
    setTimeout(() => {
      const list = rootRef.current?.querySelector('.tf-repeater-items')
      const row = list?.children[to] as HTMLElement | undefined
      const target = row?.querySelector<HTMLElement>(`.tui-move-handle [data-direction="${direction}"]:not(:disabled)`)
        ?? row?.querySelector<HTMLElement>('.tui-move-handle button:not(:disabled)')
      target?.focus()
    })
  }

  /**
   * Layouts call this where they show the row index; it returns null when the
   * repeater is not sortable so they can fall back to the plain number.
   * Arrows mode: index badge between up/down, no drag grip (no drag library)
   */
  const renderMoveHandle = (i: number, { index = true } = {}) => (
    sortable
      ? <MoveHandle
          mode="arrows"
          size="sm"
          index={ index ? i + 1 : undefined }
          className="tf-repeater-move-handle"
          aria-label={ string('reorderItem', { index: i + 1 }) }
          labels={{
            moveUp   : string('moveItemUp', { index: i + 1 }),
            moveDown : string('moveItemDown', { index: i + 1 }),
            drag     : string('dragItem', { index: i + 1 })
          }}
          canMoveUp={ i > 0 }
          canMoveDown={ i < items.length - 1 }
          onMoveUp={ () => move(i, i - 1) }
          onMoveDown={ () => move(i, i + 1) }
        />
      : null
  )

  const focusAfterRemove = (index: number) => setTimeout(() => {
    const root = rootRef.current
    if (!root) return
    const list = root.querySelector('.tf-repeater-items')
    const rows = list ? Array.from(list.children) as HTMLElement[] : []
    const row = rows[Math.min(index, rows.length - 1)]
    const target = row?.querySelector<HTMLElement>('[data-tui-accordion-trigger]')
      ?? row?.querySelector<HTMLElement>(FOCUSABLE)
      ?? root.querySelector<HTMLElement>(`.tf-repeater-actions ${FOCUSABLE}`)
    target?.focus()
  })

  const renderItem = (config, row, i) => (
    <Item
      key={ row.key + i }
      values={ row }
      config={
        {
          ...config,
          repeaterRow: i
        }
      }
      onChange={ value => dispatch({
        type     : 'update',
        item     : i,
        control  : config.name,
        value    : value,
        callback : () => triggerRowCallbackEvents(row.key, config.name)
      }) }
      /**
       * Used by visbility and dependent values to detect changes and access data
       */
      data={{
        /**
         * The field value can either be from a subvalue or from the parent getter if no match
         */
        getValue: name => (
          hasField(name)
            ? (values.current[i][name] ?? '')
            : (props.data.getValue(name ?? ''))
        ),
        /**
         * Possibility to add callback event that will be triggered each time a field from the current row will
         * change
         * @todo Avoid multiple definition (currently no way to remove watch from child which not ideal)
         */
        watcher: callback => setChangeCallback(
          prevValue => [
            ...prevValue,
            (rowKey, fieldName) => {
              rowKey === row.key && config.name
                ? callback(fieldName, row.key)
                : null
            }
          ]
        )
      }}
    />
  )

  /**
   * There are some values we don't want to save (like the bulk action checbox)
   */
  const getSavedValue = () => (
    items.map(
      ({
        _bulkCheckbox,
        ...item
      }) => item
    )
  )

  /**
   * Resolve a UI string: common < layout override < user override.
   * `params` fills {placeholders}, e.g. string('confirmDeleteDescription', { index: 2 })
   */
  const string = (name, params = {}) => {
    const value = {
      ...strings.common,
      ...(strings.layoutOveride[ layout ] ?? {}),
      ...(props.strings ?? {})
    }[name] ?? name
    return Object.entries(params).reduce(
      (text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)),
      String(value)
    )
  }

  /**
   * Default function to render footer action, this has to be called
   * by the layout (which can use a different render for it)
   */
  const renderFooterActions = () => (
    repeatable && (
      <div className="tf-repeater-actions">
        <Button
          variant="outline"
          theme="primary"
          onPress={ () => dispatch({ type: 'add' }) }
          isDisabled={ maxLength <= items.length }
        >
          { string('add') }
        </Button>
        <ConfirmTrigger
          label={ string('removeAll') }
          title={ string('confirmRemoveAll') }
          isDisabled={ items.length <= 0 }
          onConfirm={ () => {
            dispatch({ type: 'clear' })
            focusAfterRemove(0)
          } }
        >
          { string('confirmRemoveAllDescription') }
        </ConfirmTrigger>
      </div>
    )
  )

  const renderCustomComponent = (action, i, customProps) => {

    /**
     * Custom component will always be a string if fields has been
     * registered from the PHP side
     *
     * If rendered from the JS side, it can either be  a string (=element name)
     * or a react component
     */
    const Component = typeof props.parts.actions[ action ] === 'string'
      ? types.get( props.parts.actions[ action ], 'element' )
      : props.parts.actions[ action ]

    return (
      <Component
        dispatch={ dispatch }
        item={ i }
        items={ items }
        { ...customProps }
      />
    )
  }

  /**
   * Default render for action button
   *
   * Render props can be overwritten by the layout if different from default
   * Component can be overwritten by the user
   *
   * Also, rendering actions from <Repeater /> instead of <Layout /> avoid
   * having to deal with props.repeatable in each layout
   */
  const renderAction = (action, i, customProps: Record<string, any> = {}) => {
    if ( ! repeatable ) return <></>;
    if ( props?.parts?.actions?.[ action ] ) {
      return renderCustomComponent( action, i, customProps )
    }
    switch( action ) {
      case 'delete': {
        const { onConfirm, buttonProps, ...confirmProps } = customProps
        return(
          <ConfirmTrigger
            label={ string('delete') }
            title={ string('confirmDelete') }
            buttonProps={{
              'aria-label': string('deleteItem', { index: i + 1 }),
              ...(buttonProps ?? {})
            }}
            { ...confirmProps }
            onConfirm={ () => {
              onConfirm ? onConfirm() : dispatch({ type : 'remove', item : i })
              focusAfterRemove(i)
            } }
          >
            { string('confirmDeleteDescription', { index: i + 1 }) }
          </ConfirmTrigger>
        )
      }
        case 'clone':
          return(
            <Button
              type="action"
              aria-label={ string('cloneItem', { index: i + 1 }) }
              isDisabled={ maxLength <= items.length }
              onPress={ () => dispatch({
                type : 'clone',
                item : items[i]
              }) }
              { ...customProps }
            >
              { string('clone') }
            </Button>
          )
    }
  }

  useEffect(() => props.onChange && props.onChange( getSavedValue() ), [items])

  return(
    <div className={ `tf-repeater tf-repeater-${layout}`} ref={ rootRef }>
      <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(getSavedValue()) } />
      { sortable &&
        <div className="tui-visually-hidden" aria-live="polite" aria-atomic="true">
          { announcement }
        </div> }
      { props.label &&
        <Title level={2} className='tf-repeater-title'>
          { props.label }
        </Title> }
      <div className={ `tf-repeater-container tf-repeater-${layout}-container` }>
        <Layout
          items={ items }
          fields={ fields }
          dispatch={ dispatch }
          rowFields={ rowFields }
          headerFields={ props.headerFields }
          renderItem={ renderItem }
          maxLength={ repeatable ? maxLength : undefined }
          title={ props.sectionTitle ?? false }
          useSwitch={ props.useSwitch }
          useBulk={ props.useBulk }
          actionsPosition={ props.actionsPosition }
          afterRow={ props.afterRow }
          beforeRow={ props.beforeRow }
          name={ props.name ?? '' }
          renderFooterActions={ renderFooterActions }
          renderAction={ renderAction }
          renderMoveHandle={ renderMoveHandle }
          sortable={ sortable }
          repeatable={ repeatable }
          parent={ props }
          string={ string }
        />
      </div>
    </div>
  )
}

export default Repeater
