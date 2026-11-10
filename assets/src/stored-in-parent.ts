import { createContext } from 'react'

/**
 * Field types that cannot be saved inside a parent's value
 *
 * A repeater, a field group / tab / accordion that is not `uncontrolled`, and
 * a dynamic value's settings all save their subfields as one JSON value. A
 * `password` field relies on being left out of the submission while untouched
 * so the stored secret is kept — inside one JSON value there is no key to
 * leave out, so saving the parent would erase it (and a typed secret would be
 * echoed back into the page with the parent's value).
 *
 * PHP applies the same rule: see format_groups() in ../../fields/format.php
 */
const notStorableInParent = [ 'password' ]

/**
 * True below any parent that saves its subfields as one value — at any depth,
 * so an `uncontrolled` group inside a repeater is still inside the repeater
 */
const StoredInParentContext = createContext(false)

const warned = new Set<string>()

/**
 * Drops subfields that cannot be stored in the parent, so the parent never
 * draws a label, column or row for a field that will not render
 */
const withoutUnstorable = (fields: any[], parent: string) => fields.filter(field => {

  if ( ! notStorableInParent.includes(field?.type ?? '') ) return true

  const key = `${ parent }:${ field.name ?? '' }`
  if ( ! warned.has(key) ) {
    warned.add(key)
    console.warn(
      `[Tangible Fields] The \`${ field.type }\` field "${ field.name ?? '' }" was dropped from a ` +
      `${ parent }: it saves its subfields as one value, so saving it would erase the stored ` +
      'secret. Render it as a top-level field, or inside parents that are all `uncontrolled`.'
    )
  }

  return false
})

export {
  StoredInParentContext,
  withoutUnstorable
}
