/**
 * Replaces all `import.meta` references with a shim object so Jest (CJS)
 * can process ESM packages that use Vite-style env checks.
 *
 * Handles both direct (`import.meta.env.DEV`) and desugared optional-chaining
 * (`_ref = import.meta.env`) patterns.
 */
module.exports = function ({ types: t }) {
  const shimObject = () => t.objectExpression([
    t.objectProperty(
      t.identifier('env'),
      t.objectExpression([
        t.objectProperty(t.identifier('DEV'), t.booleanLiteral(false)),
        t.objectProperty(t.identifier('PROD'), t.booleanLiteral(true)),
        t.objectProperty(t.identifier('MODE'), t.stringLiteral('production')),
      ])
    ),
  ])

  return {
    visitor: {
      MetaProperty(path) {
        if (
          path.node.meta.name === 'import' &&
          path.node.property.name === 'meta'
        ) {
          path.replaceWith(shimObject())
        }
      }
    }
  }
}
