/**
 * Button props for an icon-only row action. The label stays in the DOM,
 * visually hidden, so the action keeps its name for assistive tech and tests
 */
const iconAction = (
  icon: string,
  theme: 'primary' | 'danger',
  variant: 'outline' | 'ghost' = 'outline'
) => ({
  type                  : 'action',
  theme,
  variant,
  leftIconName          : icon,
  contentVisuallyHidden : true
})

export { iconAction }
