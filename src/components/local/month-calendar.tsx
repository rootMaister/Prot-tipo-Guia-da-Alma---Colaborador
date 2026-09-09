import { cn } from '@guia-da-alma/ds'

type MonthCalendarProps = {
  /** Any date inside the month to render. */
  month: Date
  selected: Date | null
  /**
   * Which days are not pickable. The design greys 1–3 August because they are past, but
   * the caller decides — the scheduling step also greys days with no slots left.
   */
  isDisabled: (date: Date) => boolean
  onSelect: (date: Date) => void
}

/**
 * The month grid of "Escolher data e horário" — `calendar-day` (1197:2230) in Figma, a
 * documented component with State=Default|Selected|Disabled.
 *
 * Local rather than the design system's `InlineDatePicker`, by decision, because that
 * component diverges on every axis this screen cares about: it wraps the grid in a
 * bordered card the design does not draw, replaces the 24px serif month title with a
 * small brand-coloured label plus prev/next chevrons, and renders 40px circular days
 * where the design has 44px cells rounded to 16px. Its `locale` is also typed as a
 * date-fns `Locale`, so rendering Portuguese month names would mean adding date-fns to
 * this app just to feed the design system. See DS-GAPS.md.
 *
 * Dates come from the platform `Intl`/`Date`, so no dependency is needed either way.
 */

const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

/**
 * Month and year are formatted apart and joined with a space: asking `Intl` for both at
 * once yields "agosto de 2026" in pt-BR, and the design writes "Agosto 2026".
 */
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

export function MonthCalendar({ month, selected, isDisabled, onSelect }: MonthCalendarProps) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  // Leading blanks so day 1 lands under its weekday, then one cell per day, then trailing
  // blanks so the final row keeps its columns instead of stretching two days across seven.
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const weeks: (number | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  const title = `${monthFormatter.format(month)} ${year}`

  return (
    <div className="flex w-full flex-col gap-4">
      {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
      <h2 className="font-display text-heading-s text-fg-default capitalize">{title}</h2>

      <div className="flex w-full">
        {WEEKDAY_INITIALS.map((initial, index) => (
          <div key={index} className="flex h-6 flex-1 items-center justify-center">
            <span className="text-caption text-fg-subtle">{initial}</span>
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex w-full">
          {week.map((day, dayIndex) => {
            if (day === null) {
              return <div key={dayIndex} className="h-11 flex-1" />
            }

            const date = new Date(year, monthIndex, day)
            const disabled = isDisabled(date)
            const isSelected = selected !== null && startOfDay(date) === startOfDay(selected)

            return (
              <div key={dayIndex} className="flex-1">
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(date)}
                  className={cn(
                    'text-label-s flex h-11 w-full items-center justify-center rounded-2xl',
                    'transition-colors duration-150 ease-out',
                    isSelected && 'bg-action-primary text-fg-on-action',
                    !isSelected && disabled && 'text-icon-disabled cursor-not-allowed',
                    !isSelected &&
                      !disabled &&
                      'text-fg-default hover:bg-surface-subtle cursor-pointer',
                  )}
                >
                  {day}
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
