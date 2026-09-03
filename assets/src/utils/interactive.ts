/**
 * Elements with their own click behaviour. Row-level pointer conveniences
 * (click or double-click a header/overview to toggle it) step aside when the
 * event started on one of these, including inside a MoveHandle's group
 */
const INTERACTIVE_SELECTOR = [
  'button', 'a', 'input', 'select', 'textarea', 'label',
  '[role="button"]', '[role="link"]', '[role="switch"]',
  '[role="checkbox"]', '[role="group"]'
].join(', ')

const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null

export { INTERACTIVE_SELECTOR, isInteractiveTarget }
