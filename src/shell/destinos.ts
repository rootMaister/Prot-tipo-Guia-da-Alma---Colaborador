import {
  CalendarIcon,
  HouseIcon,
  NotebookPenIcon,
  SearchIcon,
  TargetIcon,
  type LucideIcon,
} from 'lucide-react'

/**
 * The app's navigation destinations — the counterpart to a flow's `steps.ts`.
 *
 * Destinations are not steps: they have no order, no progress and no "next". What they do
 * have is a menu entry, so this file is the single source for the nav bar, the routes and
 * the index page, the same way `steps.ts` is for the flows.
 */

export type DestinoSlug = 'inicio' | 'busca' | 'agendamentos' | 'diario' | 'progresso'

export type Destino = {
  slug: DestinoSlug
  /** Menu label, taken from the rendered text in `desktop-navigation` (1526:900). */
  rotulo: string
  icone: LucideIcon
  /**
   * Whether the menu shows it on mobile. The bottom bar draws three; the desktop rail draws
   * five. Not a reflow — two different designs.
   */
  noMobile: boolean
  /**
   * Built yet. Diário and Meu progresso are drawn in the menu but have no screens in this
   * slice, so they render as they look in the design and simply do not navigate.
   */
  disponivel: boolean
  /** Figma node for the mobile frame, for the index page. */
  nodeMobile: string | null
  nodeDesktop: string | null
}

export const APP_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * The Home is drawn twice: 1429:6283 is the state with a booked session, 1448:7654 the one
 * that promotes the Match. They are states of the same screen, picked by the account, not
 * separate destinations.
 */
export const INICIO_NODES = {
  comSessao: { mobile: '1429:6283', desktop: '590:9086' },
  semSessao: { mobile: '1448:7654', desktop: '1448:8740' },
} as const

/** Search has a few states; the index links the first, the rest are reachable in the screen. */
export const BUSCA_NODES = {
  inicial: { mobile: '1316:1891', desktop: '1526:908' },
  temas: { mobile: '1324:16928', desktop: '1526:5503' },
  temasSelecionados: { mobile: '1324:16272', desktop: '1526:5804' },
  resultados: { mobile: '1324:16170', desktop: '1526:1003' },
} as const

export const destinos: readonly Destino[] = [
  {
    slug: 'inicio',
    rotulo: 'Início',
    icone: HouseIcon,
    noMobile: true,
    disponivel: true,
    nodeMobile: INICIO_NODES.comSessao.mobile,
    nodeDesktop: INICIO_NODES.comSessao.desktop,
  },
  {
    slug: 'busca',
    rotulo: 'Buscar',
    icone: SearchIcon,
    noMobile: true,
    disponivel: true,
    nodeMobile: BUSCA_NODES.inicial.mobile,
    nodeDesktop: BUSCA_NODES.inicial.desktop,
  },
  {
    slug: 'agendamentos',
    rotulo: 'Agendamentos',
    icone: CalendarIcon,
    noMobile: true,
    disponivel: true,
    nodeMobile: '1562:2156',
    nodeDesktop: '1558:1876',
  },
  {
    slug: 'diario',
    rotulo: 'Diário',
    icone: NotebookPenIcon,
    noMobile: false,
    disponivel: false,
    nodeMobile: null,
    nodeDesktop: null,
  },
  {
    slug: 'progresso',
    rotulo: 'Meu progresso',
    icone: TargetIcon,
    noMobile: false,
    disponivel: false,
    nodeMobile: null,
    nodeDesktop: null,
  },
]

export const destinosDisponiveis = destinos.filter((d) => d.disponivel)

export const findDestino = (slug: string): Destino | undefined =>
  destinos.find((d) => d.slug === slug)

export const figmaNodeUrl = (nodeId: string): string =>
  `https://www.figma.com/design/${APP_FILE_KEY}/Colaborador-UI?node-id=${nodeId.replace(':', '-')}`
