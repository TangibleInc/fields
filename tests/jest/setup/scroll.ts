/**
 * jsdom does not implement scrollIntoView, which the TUI combobox calls to
 * keep the active option visible
 *
 * @see https://github.com/jsdom/jsdom/issues/1695
 */
Element.prototype.scrollIntoView = jest.fn()
