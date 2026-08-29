import { Icon, Chip, Button } from '@tangible/ui';

type LayoutComponentEntry = {
  Component: React.ComponentType<any>;
  allowedProps: string[];
};

function ViewLinkSlot({ href, label }: { href?: string; label?: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      className="tf-enhanced-choice-view-link"
      target="_blank"
      rel="noreferrer"
      aria-label={label ? `View ${label}` : 'View'}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Icon name="lms/visible" size="md" aria-hidden="true" />
    </a>
  );
}

export const ITEM_LAYOUT_COMPONENTS: Record<string, LayoutComponentEntry> = {
  icon: { Component: Icon, allowedProps: ['name', 'size'] },
  badge: { Component: Chip, allowedProps: ['children', 'theme', 'size', 'variant'] },
  button: { Component: Button, allowedProps: ['label', 'variant', 'theme', 'size', 'href', 'target'] },
  viewLink: { Component: ViewLinkSlot, allowedProps: ['href', 'label'] },
};

export type ItemLayoutEntry = {
  component: string;
  props?: Record<string, unknown>;
  propsFromItem?: Record<string, string>;
};

export type ItemLayoutConfig = {
  prefix?: ItemLayoutEntry[];
  suffix?: ItemLayoutEntry[];
};

const pickAllowed = (props: Record<string, unknown> | undefined, allowed: string[]) => {
  if (!props || typeof props !== 'object') return {};
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => allowed.includes(key))
  );
};

const resolvePropsFromItem = (
  item: Record<string, unknown>,
  propsFromItem: Record<string, string> | undefined,
  allowed: string[]
) => {
  if (!propsFromItem || typeof propsFromItem !== 'object') return {};
  return Object.fromEntries(
    Object.entries(propsFromItem)
      .filter(([propName]) => allowed.includes(propName))
      .map(([propName, itemField]) => [propName, item[itemField]])
  );
};

export function renderItemLayoutSlots(
  item: Record<string, unknown>,
  entries: ItemLayoutEntry[] | undefined
): React.ReactNode {
  if (!entries || entries.length === 0) return null;

  return entries.map((entry, i) => {
    const registryEntry = ITEM_LAYOUT_COMPONENTS[entry.component];

    if (!registryEntry) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`EnhancedChoices: unknown itemLayout component "${entry.component}"`);
      }
      return null;
    }

    const { Component, allowedProps } = registryEntry;
    const staticProps = pickAllowed(entry.props, allowedProps);
    const itemProps = resolvePropsFromItem(item, entry.propsFromItem, allowedProps);

    // itemProps wins on conflict — per-row data is more specific than a
    // field-wide static default.
    return <Component key={i} {...staticProps} {...itemProps} />;
  });
}
