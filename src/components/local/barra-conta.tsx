import { useState } from 'react'

import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  IconButton,
  cn,
} from '@guia-da-alma/ds'
import { MenuIcon } from 'lucide-react'
import { Link } from 'react-router'

import moeda from '@/assets/app/calma-coin.svg'
import { useConta } from '@/state/conta-provider'
import { destinosNoMenu, findDestino } from '@/shell/destinos'

/**
 * The status strip at the top of the Home — level, points and Calma coins (1429:6287 on
 * mobile, 1448:8726 on desktop). Mobile leads with a menu button; desktop drops it, since
 * the rail is already on screen.
 *
 * DS-GAPs, all left as the design system renders them rather than patched over:
 * - "Nível 1" is `#e5d7f7` on `#63359a`, a violet that exists nowhere in the DS — not as a
 *   `category-*` family, and not as `brand-lavender`, which is a pinker purple (#E5BAEE).
 *   `Badge variant="info"` (indigo) is the nearest. In the file the colour is a raw hex,
 *   bound to no variable at all.
 * - "123 pts" is `category/green/surface-strong` (#BAE384); `Badge variant="success"` paints
 *   `category/green/surface` (#ECFACA) and the component has no strong option.
 * - The menu button is 58px; `IconButton` is fixed at 42px and takes no size prop.
 * See DS-GAPS.md.
 */
export function BarraConta({ className }: { className?: string }) {
  const { conta } = useConta()

  return (
    <div className={cn('flex w-full items-center gap-2.5', className)}>
      <MenuButton />

      <div className="flex min-w-0 flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="info">Nível {conta.nivel}</Badge>
          <Badge variant="success">{conta.pontos} pts</Badge>
        </div>

        <p className="bg-action-primary-hover border-outline-default text-label-s text-action-accent flex items-center gap-4 rounded-full border-[0.5px] py-2 pr-2 pl-3">
          {conta.moedas}
          <img src={moeda} alt="Calma Coins" className="h-5 w-7" />
        </p>
      </div>
    </div>
  )
}

const PERFIL = findDestino('meus-dados')

/**
 * The mobile-only menu button, também usado pelo Meu diário, cujo frame o desenha sozinho no
 * topo. What it opens is not drawn anywhere in the file — the only
 * place Diário appears is the desktop rail — so it lists the same destinations that rail
 * does, mais "Meus dados" no pé. See SYNC-FIGMA.md.
 */
export function MenuButton() {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <IconButton
        icon={<MenuIcon className="size-[18px]" />}
        aria-label="Menu"
        className="lg:hidden"
        onClick={() => setAberto(true)}
      />

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>

          <nav className="flex flex-col gap-2">
            {destinosNoMenu.map((destino) => {
              const Icone = destino.icone
              const classe = 'text-label-m flex items-center gap-4 rounded-full px-4 py-3'

              return destino.disponivel ? (
                <Link
                  key={destino.slug}
                  to={`/app/${destino.slug}`}
                  onClick={() => setAberto(false)}
                  className={cn(classe, 'text-fg-default hover:bg-surface-subtle')}
                >
                  <Icone className="size-6" aria-hidden />
                  {destino.rotulo}
                </Link>
              ) : (
                <span
                  key={destino.slug}
                  aria-disabled="true"
                  className={cn(classe, 'text-fg-disabled cursor-not-allowed')}
                >
                  <Icone className="size-6" aria-hidden />
                  {destino.rotulo}
                </span>
              )
            })}

            {/*
              Meus dados não está no menu de nenhum dos dois desenhos: no desktop se chega a
              ela pelo perfil, no pé da régua. No mobile não há perfil desenhado em lugar
              nenhum, e esta folha é o que mais se parece com um — então a porta fica aqui,
              separada dos destinos. Ver SYNC-FIGMA.md.
            */}
            {PERFIL ? (
              <Link
                to={`/app/${PERFIL.slug}`}
                onClick={() => setAberto(false)}
                className={cn(
                  'text-label-m flex items-center gap-4 rounded-full px-4 py-3',
                  'border-outline-subtle text-fg-default hover:bg-surface-subtle mt-2 border-t pt-5',
                )}
              >
                <PERFIL.icone className="size-6" aria-hidden />
                {PERFIL.rotulo}
              </Link>
            ) : null}
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}
