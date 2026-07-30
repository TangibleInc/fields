import { useCallback, useEffect, useRef } from 'react'
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { history, undo, redo } from 'prosemirror-history'
import {
  baseKeymap,
  deleteSelection,
  selectAll,
} from 'prosemirror-commands'

import { dynamicTextSchema } from './schema'
import { stringToDoc, docToString } from './serialise'
import { DynamicValueView } from './node-views/DynamicValueView'
import type { DynamicValueViewOptions } from './node-views/DynamicValueView'
import { singleLinePlugins } from './plugins/single-line'
import { placeholderPlugin } from './plugins/placeholder'
import { dedupIdsPlugin } from './plugins/dedup-ids'
import { replaceOnTypePlugin } from './plugins/replace-on-type'
import { generateId } from '../../utils/generate-id'

export interface UseProseMirrorEditorOptions {
  value: string
  defaultValue?: string
  onChange: (value: string) => void
  getLabel: (raw: string) => { category: string; name: string }
  onEditToken: (id: string) => void
  readOnly?: boolean
  placeholder?: string
  singleLine?: boolean
}

export interface UseProseMirrorEditorReturn {
  containerRef: React.RefCallback<HTMLDivElement>
  focus: () => void
  insertDynamicValue: (raw: string) => void
  updateDynamicValueById: (id: string, newRaw: string) => void
  findTokenRaw: (id: string) => string | undefined
}

export function useProseMirrorEditor(
  options: UseProseMirrorEditorOptions
): UseProseMirrorEditorReturn {
  const viewRef = useRef<EditorView | null>(null)
  const lastEmittedRef = useRef<string>(options.value ?? options.defaultValue ?? '')
  const isFocusedRef = useRef(false)
  const pendingExternalRef = useRef<string | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  // Determine if controlled
  const isControlled = options.value !== undefined

  /**
   * Create the EditorView when the container mounts.
   */
  const containerRef = useCallback(
    (container: HTMLDivElement | null) => {
      // Destroy previous view if container changes
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }

      if (!container) return

      const initialValue =
        options.value ?? options.defaultValue ?? ''

      const doc = stringToDoc(initialValue, options.singleLine)
      lastEmittedRef.current = initialValue

      const plugins = [
        history(),
        keymap({
          'Mod-z': undo,
          'Mod-Shift-z': redo,
          'Mod-y': redo,
          'Mod-a': selectAll,
          Backspace: deleteSelection,
          Delete: deleteSelection,
        }),
        ...(options.singleLine
          ? singleLinePlugins({
              onEnterNodeSelection: () => {
                const view = viewRef.current
                if (!view) return false
                const { selection } = view.state
                if (
                  selection instanceof NodeSelection &&
                  selection.node.type.name === 'dynamicValue'
                ) {
                  optionsRef.current.onEditToken(selection.node.attrs.id)
                  return true
                }
                return false
              },
            })
          : [
              keymap({
                Enter: (state, dispatch) => {
                  // If NodeSelection on dynamicValue → open modal
                  if (
                    state.selection instanceof NodeSelection &&
                    state.selection.node.type.name === 'dynamicValue'
                  ) {
                    optionsRef.current.onEditToken(
                      state.selection.node.attrs.id
                    )
                    return true
                  }
                  // Otherwise insert newline
                  if (!dispatch) return false
                  const { $from } = state.selection
                  const tr = state.tr.split($from.pos)
                  dispatch(tr)
                  return true
                },
              }),
            ]),
        keymap(baseKeymap),
        placeholderPlugin(options.placeholder ?? '', options.readOnly),
        dedupIdsPlugin(),
        replaceOnTypePlugin(),
      ]

      const state = EditorState.create({
        doc,
        plugins,
      })

      const view = new EditorView(container, {
        state,
        editable: () => !optionsRef.current.readOnly,
        nodeViews: {
          dynamicValue(node, view, getPos) {
            return new DynamicValueView(node, view, getPos, {
              getLabel: optionsRef.current.getLabel,
              onEdit: optionsRef.current.onEditToken,
              readOnly: optionsRef.current.readOnly ?? false,
            } as DynamicValueViewOptions)
          },
        },
        handleDoubleClickOn(view, pos, node) {
          if (node.type.name === 'dynamicValue') {
            optionsRef.current.onEditToken(node.attrs.id)
            return true
          }
          return false
        },
        dispatchTransaction(tr) {
          const view = viewRef.current
          if (!view) return

          const newState = view.state.apply(tr)
          view.updateState(newState)

          if (tr.docChanged) {
            const serialised = docToString(newState.doc)
            lastEmittedRef.current = serialised
            optionsRef.current.onChange(serialised)
          }
        },
      })

      // Track focus state
      view.dom.addEventListener('focus', () => {
        isFocusedRef.current = true
      })
      view.dom.addEventListener('blur', () => {
        isFocusedRef.current = false

        // Apply pending external value on blur
        if (
          pendingExternalRef.current !== null &&
          pendingExternalRef.current !== lastEmittedRef.current
        ) {
          replaceDoc(pendingExternalRef.current)
          pendingExternalRef.current = null
        }
      })

      viewRef.current = view
    },
    // Intentionally empty — we only rebuild on mount/unmount
    []
  )

  /**
   * Controlled value reconciliation.
   */
  useEffect(() => {
    if (!isControlled) return
    if (!viewRef.current) return

    const externalValue = options.value
    if (externalValue === lastEmittedRef.current) return

    if (isFocusedRef.current) {
      // Don't clobber in-progress edits — store for blur
      pendingExternalRef.current = externalValue
    } else {
      replaceDoc(externalValue)
    }
  }, [options.value])

  /**
   * Update readOnly
   */
  useEffect(() => {
    if (!viewRef.current) return
    // Trigger re-evaluation of editable()
    viewRef.current.setProps({
      editable: () => !options.readOnly,
    })
  }, [options.readOnly])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [])

  /**
   * Replace the full document from a stored string.
   */
  function replaceDoc(value: string) {
    const view = viewRef.current
    if (!view) return

    const newDoc = stringToDoc(value, optionsRef.current.singleLine)
    const tr = view.state.tr.replaceWith(
      0,
      view.state.doc.content.size,
      newDoc.content
    )
    tr.setMeta('external', true)
    view.dispatch(tr)
    lastEmittedRef.current = value
  }

  /**
   * Insert a dynamic value at the current selection or end of doc.
   */
  const insertDynamicValue = useCallback((raw: string) => {
    const view = viewRef.current
    if (!view) return

    const id = generateId()
    const node = dynamicTextSchema.nodes.dynamicValue.create({ raw, id })
    const { state } = view

    let insertPos: number
    if (isFocusedRef.current) {
      insertPos = state.selection.from
      // If there's a selection range, replace it
      if (state.selection.from !== state.selection.to) {
        const tr = state.tr.replaceWith(
          state.selection.from,
          state.selection.to,
          node
        )
        view.dispatch(tr)
        return
      }
    } else {
      // Insert before the last position (inside the last block)
      insertPos = state.doc.content.size - 1
    }

    const tr = state.tr.insert(insertPos, node)
    view.dispatch(tr)
  }, [])

  /**
   * Update a dynamic value by its unique ID.
   */
  const updateDynamicValueById = useCallback(
    (id: string, newRaw: string) => {
      const view = viewRef.current
      if (!view) return

      const { doc, tr } = view.state
      let found = false

      doc.descendants((node, pos) => {
        if (found) return false
        if (
          node.type.name === 'dynamicValue' &&
          node.attrs.id === id
        ) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            raw: newRaw,
          })
          found = true
          return false
        }
      })

      if (found) {
        view.dispatch(tr)
      }
    },
    []
  )

  /**
   * Find the current raw value of a token by its ID.
   */
  const findTokenRaw = useCallback((id: string): string | undefined => {
    const view = viewRef.current
    if (!view) return undefined

    let result: string | undefined
    view.state.doc.descendants(node => {
      if (result !== undefined) return false
      if (
        node.type.name === 'dynamicValue' &&
        node.attrs.id === id
      ) {
        result = node.attrs.raw
        return false
      }
    })

    return result
  }, [])

  /**
   * Imperatively focus the editor.
   */
  const focus = useCallback(() => {
    viewRef.current?.focus()
  }, [])

  return {
    containerRef,
    focus,
    insertDynamicValue,
    updateDynamicValueById,
    findTokenRaw,
  }
}
