/**
 * Props for an icon-only row action: the fields Button renders a TUI
 * IconButton (tooltip on) and uses the action's label as its accessible name
 */
const iconAction = (
  icon: string,
  theme: 'secondary' | 'danger',
  variant: 'outline' | 'ghost' = 'outline'
) => ({
  icon,
  theme,
  variant
})

export { iconAction }
