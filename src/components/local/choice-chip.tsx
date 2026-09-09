import { cn } from '@guia-da-alma/ds'

type ChoiceChipProps = {
  label: string
  selected: boolean
  onToggle: () => void
}

/**
 * The pill that picks weekdays on "Suas sessões" — `Chip` (28162:4) in Figma.
 *
 * Named `ChoiceChip` to avoid colliding with the design system's `Chip`, which shares the
 * name but is a different component: a `rounded-md` category tag on a category surface,
 * with an optional dismiss ✕. `Tag` is no closer — also `rounded-md`, on `surface-subtle`
 * with an `outline-default` border. Neither is a selectable filter pill, and neither has a
 * selected state. See DS-GAPS.md.
 *
 * Selected state from the "- filled" frame (1119:12542): the pill inverts to
 * `action/primary` with `fg/on-action` text.
 */
export function ChoiceChip({ label, selected, onToggle }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'text-label-m cursor-pointer rounded-full border px-4 py-2',
        'transition-colors duration-150 ease-out',
        selected
          ? 'bg-action-primary text-fg-on-action border-action-primary hover:bg-action-primary-hover hover:border-action-primary-hover'
          : 'bg-surface-base text-fg-muted border-outline-subtle hover:bg-surface-subtle hover:border-outline-default',
      )}
    >
      {label}
    </button>
  )
}
