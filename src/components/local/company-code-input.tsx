import { useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from 'react'

import { cn } from '@guia-da-alma/ds'

export const COMPANY_CODE_LENGTH = 6

type CompanyCodeInputProps = {
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

/**
 * Six-digit company code field — `company-code-identifier` in Figma (set 1017:272,
 * `State=Filled|Empty`).
 *
 * Local on purpose: in Figma this is a component of the Colaborador UI file, not of the
 * shared library, and the design-system has no OTP-style input. Keeping it local mirrors
 * that same boundary. See DS-GAPS.md.
 *
 * Note on radius: Figma binds these boxes to `radius/lg` = 12px, which in the design
 * system's Tailwind scale is `rounded-xl` — its `rounded-lg` is 8px. The two scales are
 * offset by one step.
 */
export function CompanyCodeInput({
  value,
  onChange,
  error = false,
  disabled = false,
  autoFocus = false,
  className,
}: CompanyCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const digits = Array.from({ length: COMPANY_CODE_LENGTH }, (_, index) => value[index] ?? '')

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus()
    inputsRef.current[index]?.select()
  }

  const writeDigits = (nextDigits: string[]) => {
    onChange(nextDigits.join('').slice(0, COMPANY_CODE_LENGTH))
  }

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.value.replace(/\D/g, '')

    if (!typed) {
      return
    }

    const nextDigits = [...digits]

    // Typing over a filled box replaces it; a multi-character value (autofill, or a
    // fast typist) spills into the boxes to the right.
    typed.split('').forEach((digit, offset) => {
      if (index + offset < COMPANY_CODE_LENGTH) {
        nextDigits[index + offset] = digit
      }
    })

    writeDigits(nextDigits)

    const nextIndex = Math.min(index + typed.length, COMPANY_CODE_LENGTH - 1)
    focusInput(nextIndex)
  }

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      const nextDigits = [...digits]

      if (nextDigits[index]) {
        // Clear the current box and stay put.
        nextDigits[index] = ''
        writeDigits(nextDigits)
        return
      }

      // Already empty — step back and clear the previous one.
      if (index > 0) {
        nextDigits[index - 1] = ''
        writeDigits(nextDigits)
        focusInput(index - 1)
      }
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < COMPANY_CODE_LENGTH - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, COMPANY_CODE_LENGTH)

    if (!pasted) {
      return
    }

    onChange(pasted)
    focusInput(Math.min(pasted.length, COMPANY_CODE_LENGTH - 1))
  }

  return (
    <div className={cn('flex h-[71px] w-full gap-2', className)} role="group" aria-label="Código da empresa">
      {digits.map((digit, index) => (
        <input
          // The boxes are positional and never reordered, so the index is the identity.
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={COMPANY_CODE_LENGTH}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Dígito ${index + 1} de ${COMPANY_CODE_LENGTH}`}
          aria-invalid={error || undefined}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          className={cn(
            'bg-surface-subtle border-outline-subtle text-fg-muted font-display text-heading-m',
            'h-full min-w-0 flex-1 rounded-xl border px-3 py-2 text-center',
            'transition-colors focus-visible:outline-none',
            // Same focus ring the DS `Input` draws, so the code boxes match every other
            // field in the form: brand border plus the two-layer 2px/4px shadow.
            error
              ? 'border-outline-error focus-visible:border-outline-error focus-visible:shadow-[0_0_0_2px_var(--color-surface-error-subtle),0_0_0_4px_var(--color-accent-error)]'
              : 'focus-visible:border-outline-brand focus-visible:shadow-[0_0_0_2px_var(--color-action-primary-subtle),0_0_0_4px_var(--color-focus-ring)]',
            disabled && 'text-fg-disabled cursor-not-allowed',
          )}
        />
      ))}
    </div>
  )
}
