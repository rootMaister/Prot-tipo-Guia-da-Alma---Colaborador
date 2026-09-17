import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Checkbox, IconButton } from '@guia-da-alma/ds'
import { ArrowLeftIcon, CheckIcon } from 'lucide-react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { FeedbackShell } from '@/components/layout/feedback-shell'
import { NavShell } from '@/components/layout/nav-shell'
import { StepChromeProvider, StepFooter } from '@/components/layout/step-chrome'
import { DESKTOP, useMediaQuery } from '@/lib/use-media-query'
import { lerOrigem } from '@/lib/origem'
import { InicioScreen } from '@/shell/screens/inicio-screen'
import { influences, moods } from './mood-data'
import { MoodBackground, MoodOrb } from './mood-orb'
import './mood.css'

export function MoodScreen() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [params, setParams] = useSearchParams()
  const desktop = useMediaQuery(DESKTOP)
  const [value, setValue] = useState(2)
  const [choices, setChoices] = useState<string[]>([])
  const [registered, setRegistered] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const influenceStep = params.get('etapa') === 'influencias'
  const mood = moods[Math.round(value)]
  const origin = lerOrigem(search, '/')
  const close = useCallback(() => navigate(origin), [navigate, origin])
  const step = (influences: boolean) => {
    const next = new URLSearchParams(params)
    if (influences) next.set('etapa', 'influencias')
    else next.delete('etapa')
    setParams(next)
  }

  useEffect(() => { heading.current?.focus() }, [influenceStep, registered])
  useEffect(() => { if (!influenceStep) setRegistered(false) }, [influenceStep])

  const toggle = (influence: string) => setChoices(previous =>
    previous.includes(influence) ? previous.filter(item => item !== influence) : [...previous, influence],
  )

  return <StepChromeProvider>
    <FeedbackShell
      label="Registro do diário de humor"
      surface="brand-dark-medium-25"
      decoration={<MoodBackground />}
      pergunta={null}
      totalPerguntas={2}
      onBack={() => step(false)}
      onFechar={close}
      fundo={desktop ? <NavShell slugAtivo="inicio"><InicioScreen /></NavShell> : undefined}
    >
      {registered ? <div className="mood-complete text-fg-default">
        <CheckIcon size={32} aria-hidden="true" />
        <h1 ref={heading} tabIndex={-1} className="font-display text-heading-m">Registro concluído</h1>
        <p className="text-body-m">{mood.label}</p>
        <p className="text-body-s text-fg-subtle">{choices.join(' · ')}</p>
        <p className="text-body-s text-fg-subtle" role="status">Seu humor e os pontos de influência foram registrados.</p>
      </div> : influenceStep ? <section className="mood-influences text-fg-default" aria-labelledby="influence-title">
        <IconButton icon={<ArrowLeftIcon size={18} />} aria-label="Voltar ao humor" onClick={() => step(false)} className="self-start" />
        <h1 id="influence-title" ref={heading} tabIndex={-1} className="font-display text-heading-m text-center">Quais os principais motivos?</h1>
        <p className="text-body-s text-fg-subtle text-center">{mood.label} · Selecione o que influenciou seu dia.</p>
        {/* DS-GAP: selectable checkbox pills are local, like ChoiceChip (item 18). */}
        <div className="mood-influence-options" role="group" aria-label="Pontos de influência">
          {influences.map((influence, index) => <label key={influence} className="mood-influence text-label-s" data-selected={choices.includes(influence)} htmlFor={`influence-${index}`}>
            <Checkbox id={`influence-${index}`} checked={choices.includes(influence)} onCheckedChange={() => toggle(influence)} />
            <span>{influence}</span>
          </label>)}
        </div>
      </section> : <section className="mood-content text-fg-default" aria-labelledby="mood-title">
        <h1 id="mood-title" ref={heading} tabIndex={-1} className="font-display text-heading-m">Como está sendo<br />o seu dia?</h1>
        <div className="mood-space"><MoodOrb value={value} /></div>
        <div className="mood-description" aria-live="polite" aria-atomic="true">
          <p className="font-display text-heading-s">{mood.label}</p>
          <p id="mood-hint" className="text-body-s text-fg-subtle">{mood.hint}</p>
        </div>
        {/* DS-GAP: continuous five-stop mood slider has no DS equivalent. */}
        <div className="mood-slider">
          <div className="mood-ticks" aria-hidden="true">{moods.map(item => <i key={item.label} />)}</div>
          <input
            aria-label="Como está sendo o seu dia?"
            aria-describedby="mood-hint"
            aria-valuetext={mood.label}
            type="range" min="0" max="4" step="0.01" value={value}
            onChange={event => setValue(Number(event.target.value))}
            onPointerUp={event => setValue(Math.round(Number(event.currentTarget.value)))}
            onPointerCancel={() => setValue(Math.round(value))}
            onBlur={() => setValue(Math.round(value))}
            onKeyDown={event => {
              const actions: Record<string, number> = { ArrowLeft: Math.round(value) - 1, ArrowDown: Math.round(value) - 1, ArrowRight: Math.round(value) + 1, ArrowUp: Math.round(value) + 1, Home: 0, End: 4 }
              if (event.key in actions) { event.preventDefault(); setValue(Math.max(0, Math.min(4, actions[event.key]))) }
            }}
          />
        </div>
        <div className="mood-ends text-body-s"><span>Difícil</span><span>Fluindo</span></div>
      </section>}
      <StepFooter>
        <Button className="w-full lg:flex-1" disabled={influenceStep && !registered && choices.length === 0} onClick={() => {
          if (registered) close()
          else if (influenceStep) setRegistered(true)
          else { setValue(Math.round(value)); step(true) }
        }}>{registered ? 'Concluir' : influenceStep ? 'Salvar registro' : 'Registrar'}</Button>
        {!registered && <Button variant="text-neutral" className="w-full lg:flex-1" onClick={close}>Deixar para depois</Button>}
      </StepFooter>
    </FeedbackShell>
  </StepChromeProvider>
}
