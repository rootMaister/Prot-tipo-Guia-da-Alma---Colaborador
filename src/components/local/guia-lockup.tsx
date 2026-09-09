import { cn, GuiaDaAlmaSymbol, GuiaDaAlmaWordmark } from '@guia-da-alma/ds'

const GAP_PX = 6

type GuiaLockupProps = {
  /** Height of the lockup in px — symbol and wordmark share it, as they do in Figma. */
  height?: number
  className?: string
}

/**
 * Guia da Alma lockup.
 *
 * Composed here instead of using the design system's `GuiaDaAlmaLockup`, which is
 * unusable: it types its props as `SVGProps` but renders a `<div>`, and spreads the same
 * `props` into *both* child SVGs **after** their own `className`. Any className the caller
 * passes — even just a colour — therefore wipes out `h-[21px] w-auto` on the symbol and
 * `h-[15px] w-auto` on the wordmark, and both blow up to the caller's size. See DS-GAPS.md
 * item 5; it renders visibly broken, not subtly.
 *
 * Geometry follows the design rather than the design system's defaults: Figma draws the
 * lockup at 188×26, 130×18 and 240×33 across the flow, and in every one of those the
 * symbol and the wordmark are the same height (width works out at ~7.06× the height).
 * The DS component instead sizes the wordmark at 15/21 of the symbol.
 */
export function GuiaLockup({ height = 26, className }: GuiaLockupProps) {
  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap: GAP_PX }}
      role="img"
      aria-label="Guia da Alma"
    >
      <GuiaDaAlmaSymbol style={{ height, width: 'auto' }} className="shrink-0" />
      <GuiaDaAlmaWordmark style={{ height, width: 'auto' }} className="shrink-0" />
    </div>
  )
}
