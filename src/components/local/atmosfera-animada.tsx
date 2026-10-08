import { useEffect, useRef } from 'react'

import receita from '@/assets/cadastro/welcome-blend.json'

/**
 * A atmosfera do Welcome — o campo de cor em movimento do painel editorial (`2020:649`) e do
 * fundo da tela mobile (`2028:647`).
 *
 * A fonte é a **receita** `blend` em `assets/cadastro/welcome-blend.json`, desenhada aqui em
 * canvas: quatro paradas, os divisores entre elas, o `soften`, o `noise` e a `speed`. O
 * arquivo entra como veio, sem ajuste — o que este componente faz é interpretá-lo.
 *
 * O vídeo exportado do Figma chegou a ocupar este lugar; a receita voltou porque descreve a
 * arte em 522 bytes, serve qualquer proporção e não depende de autoplay. Os arquivos
 * `welcome-atmosfera.*` (webm, mp4 e poster, 2 MB) foram apagados junto com a troca — o
 * histórico do git guarda, se o vídeo voltar a ser a escolha.
 *
 * **A malha é pintada pequena e esticada pelo CSS.** Cada quadro é escrito pixel a pixel em
 * JavaScript, então o custo cresce com a área: encher metade de uma tela de 1440 seriam
 * centenas de milhares de pixels por quadro. Como a arte é uma mancha borrada, pintar numa
 * grade de ~96px e deixar o navegador interpolar dá a mesma imagem por uma fração do
 * trabalho — medido em 0,09 ms por quadro.
 *
 * Roda em looping contínuo a 60 quadros por segundo, pausa em aba oculta e respeita
 * `prefers-reduced-motion`, congelando num quadro em vez de sumir.
 */

const clamp = (valor: number) => Math.max(0, Math.min(1, valor))
const suavizar = (valor: number) => {
  const t = clamp(valor)
  return t * t * (3 - 2 * t)
}

/** Lado maior da grade pintada. O resto é o CSS esticando. */
const GRADE = 96
/** Quadros por segundo. */
const FPS = 60
/**
 * Onde a animação começa. Na fase 0 a segunda onda — uma onda plana, `cos(ny·3 − nx·1,6)` —
 * atravessa o painel como uma faixa diagonal reta, e como a `speed` da receita avança a fase
 * devagar, era essa faixa que ficava na tela nos primeiros segundos de toda visita. 3,6 é o
 * ponto a que o loop chegava aos ~12s, já com as manchas desenhadas. O movimento é o mesmo;
 * só a abertura pula o trecho ruim — e é também o quadro que fica parado com
 * `prefers-reduced-motion`.
 */
const FASE_INICIAL = 3.6

export function AtmosferaAnimada({
  proporcao = 1,
  className,
}: {
  /** Proporção da grade, para a malha não achatar em telas muito altas ou largas. */
  proporcao?: number
  className?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const contexto = canvas.current?.getContext('2d')
    if (!contexto) return

    const largura = proporcao >= 1 ? GRADE : Math.max(24, Math.round(GRADE * proporcao))
    const altura = proporcao >= 1 ? Math.max(24, Math.round(GRADE / proporcao)) : GRADE
    canvas.current!.width = largura
    canvas.current!.height = altura

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pixels = contexto.createImageData(largura, altura)

    // Grão fixo e centrado, na intensidade que a receita pede: a textura se move sem cintilar.
    const grao = Float32Array.from({ length: largura * altura }, (_, i) => {
      const semente = Math.sin(i * 127.1 + 311.7) * 43758.5453
      return (semente - Math.floor(semente) - 0.5) * (receita.noise / 255)
    })

    /**
     * A receita vira uma tabela de 256 cores: para cada posição do gradiente, a mistura das
     * paradas segundo os `dividers` e o `soften`. Feita uma vez; o laço de pintura consulta.
     */
    const tabela = new Uint8ClampedArray(256 * 3)
    for (let indice = 0; indice < 256; indice++) {
      const posicao = indice / 255
      const cor = [...receita.stops[0].rgb]

      for (let parada = 0; parada < receita.stops.length - 1; parada++) {
        const inicio = receita.stops[parada].position
        const fim = receita.stops[parada + 1].position
        const divisor = receita.dividers[parada] ?? (inicio + fim) / 2
        const faixa = (fim - inicio) * (1 + receita.soften / 100)
        const peso = suavizar((posicao - divisor) / faixa + 0.5)
        const proxima = receita.stops[parada + 1].rgb

        for (let canal = 0; canal < 3; canal++) {
          cor[canal] += (proxima[canal] - cor[canal]) * peso
        }
      }

      tabela[indice * 3] = cor[0]
      tabela[indice * 3 + 1] = cor[1]
      tabela[indice * 3 + 2] = cor[2]
    }

    let fase = FASE_INICIAL
    let anterior = 0
    let quadro = 0
    let descartado = false

    function pintar() {
      for (let y = 0; y < altura; y++) {
        const ny = y / altura
        for (let x = 0; x < largura; x++) {
          const nx = x / largura
          /*
            Duas ondas cruzadas. A fase entra **dentro** delas, não somada ao resultado:
            somada, ela desloca o campo inteiro pela paleta e a tela pulsa de cor; por
            dentro, ela move o desenho e a composição se mantém.
          */
          const onda =
            Math.sin(nx * 3.4 + Math.cos(ny * 2.6 + fase * 0.8) * 1.2) * 0.55 +
            Math.cos(ny * 3 - nx * 1.6 - fase * 0.6) * 0.45
          const posicao = clamp(onda * 0.45 + 0.5 + grao[y * largura + x])
          const cor = Math.round(posicao * 255) * 3
          const pixel = (y * largura + x) * 4

          pixels.data[pixel] = tabela[cor]
          pixels.data[pixel + 1] = tabela[cor + 1]
          pixels.data[pixel + 2] = tabela[cor + 2]
          pixels.data[pixel + 3] = 255
        }
      }

      contexto!.putImageData(pixels, 0, 0)
    }

    function animar(agora: number) {
      quadro = 0
      if (descartado || reduzido.matches || document.hidden) return
      if (!anterior) anterior = agora

      if (agora - anterior >= 1000 / FPS) {
        fase += (Math.min(agora - anterior, 100) / 1000) * (receita.speed / 100)
        anterior = agora
        pintar()
      }

      quadro = requestAnimationFrame(animar)
    }

    function sincronizar() {
      cancelAnimationFrame(quadro)
      anterior = 0
      pintar()
      if (!reduzido.matches && !document.hidden) quadro = requestAnimationFrame(animar)
    }

    sincronizar()
    reduzido.addEventListener('change', sincronizar)
    document.addEventListener('visibilitychange', sincronizar)

    return () => {
      descartado = true
      cancelAnimationFrame(quadro)
      reduzido.removeEventListener('change', sincronizar)
      document.removeEventListener('visibilitychange', sincronizar)
    }
  }, [proporcao])

  /*
    O desfoque alisa o que sobra da interpolação, e a escala de 1.12 joga a borda desfocada
    para fora da caixa — sem ela, o desfoque comeria as quinas e deixaria ver o fundo.
  */
  return (
    <canvas
      ref={canvas}
      aria-hidden
      style={{ filter: 'blur(12px)', transform: 'scale(1.12)' }}
      className={className}
    />
  )
}
