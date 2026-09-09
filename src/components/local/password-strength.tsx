import { ProgressBar } from '@guia-da-alma/ds'

const MIN_LENGTH = 8

type Nivel = {
  rotulo: string
  /** Percentage passed to the bar. */
  valor: number
  /** Category token for the label — the bar itself cannot change colour. */
  cor: string
}

const NIVEIS: Nivel[] = [
  { rotulo: 'Muito fraca', valor: 20, cor: 'text-category-red-text' },
  { rotulo: 'Fraca', valor: 40, cor: 'text-category-red-text' },
  { rotulo: 'Razoável', valor: 60, cor: 'text-category-sunflower-text' },
  { rotulo: 'Boa', valor: 80, cor: 'text-category-green-text' },
  { rotulo: 'Forte', valor: 100, cor: 'text-category-green-text' },
]

/**
 * Scores on length first, then on how many character classes appear. Deliberately simple:
 * the point is to show the bar moving as the field is typed, not to be a real entropy
 * estimate.
 */
const pontuar = (senha: string): number => {
  if (!senha) {
    return -1
  }

  let pontos = 0

  if (senha.length >= MIN_LENGTH) pontos += 1
  if (senha.length >= 12) pontos += 1
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos += 1
  if (/\d/.test(senha)) pontos += 1
  if (/[^A-Za-z0-9]/.test(senha)) pontos += 1

  return Math.min(pontos, NIVEIS.length - 1)
}

type PasswordStrengthProps = {
  senha: string
}

/**
 * Strength meter under the password field. Not in the Figma file — added in review, so it
 * is one of the few pieces here with no node to check against, and a candidate to draw
 * into the design.
 *
 * DS-GAP: `ProgressBar` fills in `action-primary` and takes no colour variant, so a bar
 * that goes red → amber → green is not expressible without overriding its class. It is
 * used as the design system renders it, and the strength is signalled by the label
 * beside it, which is our own element. See DS-GAPS.md.
 */
export function PasswordStrength({ senha }: PasswordStrengthProps) {
  const indice = pontuar(senha)

  if (indice < 0) {
    return null
  }

  const nivel = NIVEIS[indice]

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <ProgressBar value={nivel.valor} />
      <p className={`text-caption ${nivel.cor}`} role="status">
        Força da senha: {nivel.rotulo}
      </p>
    </div>
  )
}
