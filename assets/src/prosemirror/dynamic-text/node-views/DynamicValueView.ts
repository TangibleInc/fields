import type { Node } from 'prosemirror-model'
import type { EditorView, NodeView } from 'prosemirror-view'
import { NodeSelection } from 'prosemirror-state'

export interface DynamicValueViewOptions {
  getLabel: (raw: string) => { category: string; name: string }
  onEdit: (id: string) => void
  readOnly: boolean
}

export class DynamicValueView implements NodeView {
  dom: HTMLSpanElement

  private node: Node
  private view: EditorView
  private getPos: () => number | undefined
  private options: DynamicValueViewOptions

  constructor(
    node: Node,
    view: EditorView,
    getPos: () => number | undefined,
    options: DynamicValueViewOptions
  ) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.options = options

    this.dom = this.buildDOM()
  }

  private buildDOM(): HTMLSpanElement {
    const { raw, id } = this.node.attrs
    const label = this.options.getLabel(raw)

    const pill = document.createElement('span')
    pill.className = 'tf-dynamic-pill'
    pill.setAttribute('data-raw', raw)
    pill.setAttribute('data-id', id)
    pill.setAttribute('contenteditable', 'false')
    pill.setAttribute('aria-label', `${label.category} ${label.name}`)

    // Icon
    const icon = document.createElement('span')
    icon.className = 'tf-dynamic-pill__icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = '\u26A1' // ⚡
    pill.appendChild(icon)

    // Label
    const labelEl = document.createElement('span')
    labelEl.className = 'tf-dynamic-pill__label'
    const strong = document.createElement('strong')
    strong.textContent = label.category
    labelEl.appendChild(strong)
    labelEl.appendChild(document.createTextNode(' ' + label.name))
    pill.appendChild(labelEl)

    // Kebab menu button (only when not read-only)
    if (!this.options.readOnly) {
      const menuBtn = document.createElement('button')
      menuBtn.className = 'tf-dynamic-pill__menu'
      menuBtn.type = 'button'
      menuBtn.setAttribute(
        'aria-label',
        `Edit ${label.category} ${label.name} settings`
      )
      menuBtn.textContent = '\u22EE' // ⋮
      pill.appendChild(menuBtn)
    }

    return pill
  }

  /**
   * Intercept events on the kebab menu button.
   * mousedown/pointerdown: prevent ProseMirror default, select pill, open modal
   * click: swallow to prevent double-triggering
   */
  stopEvent(event: Event): boolean {
    const target = event.target as HTMLElement
    if (!target.closest('.tf-dynamic-pill__menu')) return false

    if (event.type === 'mousedown' || event.type === 'pointerdown') {
      event.preventDefault()

      const pos = this.getPos()
      if (pos == null) return true

      // Select the pill node
      const tr = this.view.state.tr.setSelection(
        NodeSelection.create(this.view.state.doc, pos)
      )
      this.view.dispatch(tr)

      // Open edit modal
      this.options.onEdit(this.node.attrs.id)
      return true
    }

    // Swallow click on kebab
    return true
  }

  ignoreMutation(): boolean {
    return true
  }

  update(node: Node): boolean {
    if (node.type !== this.node.type) return false

    this.node = node

    // Rebuild DOM if attrs changed
    const newDOM = this.buildDOM()
    this.dom.replaceWith(newDOM)
    this.dom = newDOM

    return true
  }
}
