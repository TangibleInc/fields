/**
 * jsdom doesn't implement window.CSS, used by react-aria selection (CSS.escape)
 *
 * @see https://github.com/jsdom/jsdom/issues/3991
 */
import 'css.escape'

// @ts-ignore
globalThis.CSS.supports ??= () => false
