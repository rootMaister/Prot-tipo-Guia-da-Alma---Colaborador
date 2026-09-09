/**
 * Input masks, written as plain functions over the digits the user typed.
 *
 * Each one is idempotent and safe to run on every keystroke: it strips everything that is
 * not a digit, caps the length, and rebuilds the punctuation. That means backspacing over
 * a separator deletes the digit before it, which is what people expect, and pasting a
 * formatted value works without a special case.
 *
 * No dependency: a masking library would be a lot of weight for two formats in a
 * prototype.
 */

/** `(11) 99999-9999` — 11 digits, and 10-digit landlines format as `(11) 9999-9999`. */
export const maskPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : ''
  }

  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)

  // The 9th digit only exists on mobile numbers, so the split moves once it appears.
  const split = rest.length > 8 ? 5 : 4

  if (rest.length <= split) {
    return `(${ddd}) ${rest}`
  }

  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`
}

/** `000.000.000-00` — 11 digits. */
export const maskCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean)
  const check = digits.slice(9, 11)

  const head = parts.join('.')

  return check ? `${head}-${check}` : head
}

/** `DD/MM/AAAA` — 8 digits. */
export const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)

  return parts.join('/')
}

/** Digits only, for length checks that should ignore punctuation. */
export const onlyDigits = (value: string): string => value.replace(/\D/g, '')
