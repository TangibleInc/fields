import { useEffect, useRef } from 'react'
import { matchesMask, maskToPlaceholder } from './input-mask'

/**
 * Input masking hook for native <input> elements.
 *
 * Architecture borrowed from @maskito/core:
 * - `beforeinput` with `preventDefault()` for all text mutations
 * - `compositionend` for IME input (CJK etc.)
 * - `input` listener as Android safety net (SwiftKey ignores preventDefault)
 * - Value guard before setting to avoid disturbing React's controlled tracking
 * - `InputEvent` dispatch for React compatibility
 *
 * Mask chars: `9` (digit), `a` (letter), `*` (alphanumeric), anything else → literal.
 */
export function useInputMask(
  inputRef: React.RefObject<HTMLInputElement | null>,
  mask: string | null | undefined
) {
  const maskRef = useRef(mask)
  maskRef.current = mask

  useEffect(() => {
    const el = inputRef.current
    if (!el || !mask) return

    const placeholder = maskToPlaceholder(mask)

    // Snapshot for Android fallback — stores what the value SHOULD be after beforeinput
    let expectedValue: string | null = null

    /** Set value + cursor, dispatch for React. */
    function commit(value: string, cursor: number) {
      expectedValue = value
      if (el!.value !== value) {
        el!.value = value
      }
      el!.setSelectionRange(cursor, cursor)
      el!.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertText' })
      )
      // Re-assert cursor after React's synchronous re-render
      requestAnimationFrame(() => {
        if (el!.selectionStart !== cursor || el!.selectionEnd !== cursor) {
          el!.setSelectionRange(cursor, cursor)
        }
      })
    }

    /** Current value as char array, clamped to mask length. */
    function getChars(): string[] {
      const chars = el!.value.split('')
      while (chars.length < mask!.length) chars.push('_')
      chars.length = mask!.length
      return chars
    }

    // ----- handlers -----

    function onFocus() {
      const m = maskRef.current
      if (!m) return
      if (!el!.value || hasNoContent(el!.value, m)) {
        const first = nextEditable(m, 0)
        commit(placeholder, first >= 0 ? first : 0)
      }
    }

    function onBlur() {
      const m = maskRef.current
      if (!m) return
      // Clear incomplete values (any placeholder char remaining)
      if (el!.value.includes('_')) {
        expectedValue = ''
        if (el!.value !== '') el!.value = ''
        el!.dispatchEvent(new InputEvent('input', { bubbles: true }))
      }
    }

    function onBeforeInput(e: InputEvent) {
      const m = maskRef.current
      if (!m) return

      // Skip composition — handled in compositionend
      if (e.inputType === 'insertCompositionText') return

      e.preventDefault()

      const chars = getChars()
      const start = el!.selectionStart ?? 0
      const end = el!.selectionEnd ?? start

      switch (e.inputType) {
        // -- insert --
        case 'insertText':
        case 'insertFromPaste':
        case 'insertFromDrop':
        case 'insertReplacementText': {
          const text =
            e.data ?? e.dataTransfer?.getData('text/plain') ?? ''
          clearRange(chars, m, start, end)
          const cursor = insertText(chars, m, start, text)
          commit(chars.join(''), cursor)
          break
        }

        // -- backward delete --
        case 'deleteContentBackward':
        case 'deleteWordBackward':
        case 'deleteSoftLineBackward':
        case 'deleteHardLineBackward': {
          if (start !== end) {
            clearRange(chars, m, start, end)
            commit(chars.join(''), start)
          } else {
            const prev = prevEditable(m, start)
            if (prev >= 0) {
              chars[prev] = '_'
              commit(chars.join(''), prev)
            }
          }
          break
        }

        // -- forward delete --
        case 'deleteContentForward':
        case 'deleteWordForward':
        case 'deleteSoftLineForward':
        case 'deleteHardLineForward': {
          if (start !== end) {
            clearRange(chars, m, start, end)
            commit(chars.join(''), start)
          } else {
            const pos = nextEditable(m, start)
            if (pos >= 0 && pos < m.length) {
              chars[pos] = '_'
              commit(chars.join(''), start)
            }
          }
          break
        }

        // -- cut --
        case 'deleteByCut': {
          clearRange(chars, m, start, end)
          commit(chars.join(''), start)
          break
        }
      }
    }

    /**
     * Android safety net — some keyboards (SwiftKey) ignore preventDefault
     * on beforeinput. If the browser mutated the value despite our prevention,
     * correct it here.
     */
    function onInput() {
      if (expectedValue !== null && el!.value !== expectedValue) {
        el!.value = expectedValue
      }
      expectedValue = null
    }

    /**
     * IME composition end — validate the result against the mask.
     * During composition, the browser controls the input. After composition
     * ends, we snap the value back to mask-valid state.
     */
    function onCompositionEnd() {
      const m = maskRef.current
      if (!m) return

      const chars: string[] = []
      let srcIdx = 0

      for (let i = 0; i < m.length; i++) {
        if (isEditable(m[i])) {
          // Find next valid char from the composed value
          while (srcIdx < el!.value.length) {
            const ch = el!.value[srcIdx++]
            if (charValid(ch, m[i])) {
              chars.push(ch)
              break
            }
          }
          if (chars.length <= i) chars.push('_')
        } else {
          chars.push(m[i])
        }
      }

      const cursor = nextEditable(m, el!.value.length) >= 0
        ? nextEditable(m, chars.lastIndexOf('_') < 0 ? m.length : chars.indexOf('_'))
        : m.length
      commit(chars.join(''), cursor >= 0 ? cursor : m.length)
    }

    el.addEventListener('focus', onFocus)
    el.addEventListener('blur', onBlur)
    el.addEventListener('beforeinput', onBeforeInput as EventListener)
    el.addEventListener('input', onInput, { capture: true })
    el.addEventListener('compositionend', onCompositionEnd)

    return () => {
      el.removeEventListener('focus', onFocus)
      el.removeEventListener('blur', onBlur)
      el.removeEventListener('beforeinput', onBeforeInput as EventListener)
      el.removeEventListener('input', onInput, { capture: true })
      el.removeEventListener('compositionend', onCompositionEnd)
    }
  }, [mask])
}

// ---------------------------------------------------------------------------
// Mask helpers
// ---------------------------------------------------------------------------

function isEditable(maskChar: string): boolean {
  return maskChar === '9' || maskChar === 'a' || maskChar === '*'
}

function charValid(char: string, maskChar: string): boolean {
  switch (maskChar) {
    case '9': return /[0-9]/.test(char)
    case 'a': return /[a-zA-Z]/.test(char)
    case '*': return /[a-zA-Z0-9]/.test(char)
    default: return false
  }
}

/** Next editable position at or after `from`. Returns -1 if none. */
function nextEditable(mask: string, from: number): number {
  for (let i = from; i < mask.length; i++) {
    if (isEditable(mask[i])) return i
  }
  return -1
}

/** Previous editable position strictly before `from`. Returns -1 if none. */
function prevEditable(mask: string, from: number): number {
  for (let i = from - 1; i >= 0; i--) {
    if (isEditable(mask[i])) return i
  }
  return -1
}

/** Replace editable positions in [start, end) with '_'. */
function clearRange(chars: string[], mask: string, start: number, end: number) {
  for (let i = start; i < end && i < mask.length; i++) {
    if (isEditable(mask[i])) chars[i] = '_'
  }
}

/**
 * Place valid chars from `text` into editable slots starting at `from`,
 * skipping over literals automatically. Returns final cursor position.
 */
function insertText(chars: string[], mask: string, from: number, text: string): number {
  let pos = nextEditable(mask, from)
  for (const ch of text) {
    if (pos < 0 || pos >= mask.length) break
    if (charValid(ch, mask[pos])) {
      chars[pos] = ch
      const next = nextEditable(mask, pos + 1)
      pos = next >= 0 ? next : mask.length
    }
    // Invalid chars silently skipped
  }
  return pos >= 0 ? pos : mask.length
}

/** True if every editable position is still '_'. */
function hasNoContent(value: string, mask: string): boolean {
  for (let i = 0; i < mask.length && i < value.length; i++) {
    if (isEditable(mask[i]) && value[i] !== '_') return false
  }
  return true
}

export { matchesMask }
