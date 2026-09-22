import { Checkbox, cn } from '@guia-da-alma/ds'

type OptionCardProps = {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/**
 * The full-width selectable option row of the Match questionnaire — `radio-group-item`
 * (679:805) in Figma, despite being a checkbox: every screen that uses it is
 * multi-select ("Marque os temas…").
 *
 * Local because the design system has no equivalent. Its `RadioGroupItem` is just the
 * 16px circle control, and `CheckboxField` is a small control-then-label row; neither
 * produces a bordered, full-width card whose whole surface toggles. See DS-GAPS.md.
 *
 * The selected treatment is only drawn on the desktop frame (1133:1393) and the "- filled"
 * variants, but it is a state of this component rather than a breakpoint difference, so it
 * applies on both. The lime fill really is bound to `fg/on-action` in the file — a
 * foreground token used as a surface, reproduced as drawn rather than swapped for the
 * identically-valued `category/green/surface`.
 */
export function OptionCard({ id, label, checked, onCheckedChange }: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'ph-no-capture flex w-full cursor-pointer items-center gap-4 rounded-2xl border py-4 pl-4 pr-6',
        'transition-colors duration-150 ease-out',
        checked
          ? 'bg-fg-on-action border-outline-success-subtle hover:border-outline-success'
          : 'bg-surface-faint border-outline-subtle hover:bg-surface-subtle hover:border-outline-default',
      )}
    >
      <span className="text-label-s text-fg-muted min-w-0 flex-1">{label}</span>

      {/*
        DS-GAP: Figma draws this box at 24px with `radius/md` (8px); the DS `Checkbox` is
        fixed at 16px with `rounded-sm` (4px) and takes no size prop. Left as the DS
        renders it. See DS-GAPS.md.
      */}
      <Checkbox id={id} checked={checked} onCheckedChange={(next) => onCheckedChange(next === true)} />
    </label>
  )
}
