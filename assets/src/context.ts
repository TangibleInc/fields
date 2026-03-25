import { createContext } from 'react'

/**
 * Used to detect the current context from child components
 *
 * Extracted to its own module to avoid circular dependencies when
 * base components (Modal, Popover) need ControlContext, as index.tsx
 * imports types.ts which imports from the base barrel
 *
 * @see ./Control.tsx
 * @see ./Element.tsx
 * @see ./components/base/modal/Modal.tsx
 * @see ./components/base/popover/Popover.tsx
 * @see ./components/dynamic/settings-modal/DynamicFieldSettings.tsx
 *
 * The circular dependency won't cause issues with tangible-roller, but Vite
 * (used by Storybook) won't support it
 *
 * @see https://github.com/TangibleInc/fields/issues/11
 */
const ControlContext = createContext(null)

export { ControlContext }
