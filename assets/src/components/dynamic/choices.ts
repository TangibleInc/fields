/**
 * Build the grouped choice list for the dynamic-value pickers (SearchSelect
 * panels + settings modal) from the dynamics config: one group per category,
 * values filtered to the field's allowed types, empty categories dropped.
 */
export const buildGroupedChoices = (dynamic: any, dynamics: any) => {
  const allowedTypes = dynamic.getTypes()
  const categoryKeys = dynamic.getCategories()

  const categories = categoryKeys.map((categoryKey: string) => {
    const category = dynamics.categories[categoryKey]
    const categoryChoices = Object.keys(dynamics.values)
      .filter(
        value =>
          category.values.includes(value) &&
          allowedTypes.includes(dynamics.values[value]?.type)
      )
      .reduce(
        (choices: Record<string, string>, key: string) => ({
          ...choices,
          [key]: dynamics.values[key].label ?? key,
        }),
        {}
      )

    return {
      name: category.label as string,
      choices: categoryChoices as Record<string, string>,
    }
  })

  return categories.filter(
    (category: { choices: Record<string, string> }) =>
      Object.keys(category.choices).length !== 0
  )
}

/** Whether a dynamic value declares a settings sub-form. */
export const valueHasSettings = (dynamics: any, valueName: string) => {
  const args = dynamics.values[valueName]?.fields
  return Array.isArray(args) && args.length > 0
}
