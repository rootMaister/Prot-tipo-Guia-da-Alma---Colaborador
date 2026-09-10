# Protótipo Colaborador UI

App React navegável que reproduz os fluxos do Figma
[Colaborador UI](https://www.figma.com/design/mHWlzkeyvbLscICaXIjkcG/Colaborador-UI),
com estados mockados e sem backend:

- **Cadastro** — seção `266:4`, página `266:3`. 9 telas, do splash ao perfil aprovado.
- **Match de terapia** — seção `791:1078`. 7 telas, que continuam direto do "Perfil
  aprovado": questionário, busca e sessões recomendadas.
- **Agendamento** — seção `1184:5843`. 5 telas, que continuam do "Ver agenda" nas sessões
  recomendadas: detalhe da sessão, data e horário, dados e confirmação.

Serve a dois propósitos: revisar os fluxos fora do Figma, e exercitar o design system
`@guia-da-alma/ds` como seu primeiro consumidor real. Lacunas encontradas vão para
[DS-GAPS.md](DS-GAPS.md) — não são contornadas em silêncio.

O protótipo já passou por um review de entrega. O que mudou por decisão da revisão, e o que
cada mudança implica no arquivo do Figma, está em [SYNC-FIGMA.md](SYNC-FIGMA.md).

## Rodar

```bash
pnpm dev            # http://localhost:5173
```

O design system **não** é mais consumido por `link:../design-system`, e sim por
`file:vendor/guia-da-alma-ds.tgz` — um snapshot commitado, gerado por:

```bash
pnpm ds:vendor      # constrói o DS local, empacota e reinstala
```

A troca foi feita para o deploy funcionar: a Vercel constrói a partir de um clone deste
repo, onde `../design-system` não existe, e a 0.1.9 publicada no GitHub Packages ainda não
exporta `IconButton`, `FeaturedIcon`, `GuiaDaAlmaSymbol` e `GuiaDaAlmaWordmark`, que este
protótipo usa. Procedência do snapshot em [vendor/PROCEDENCIA.md](vendor/PROCEDENCIA.md).

O preço é que **mexer no src do DS não chega mais aqui sozinho**. O ciclo antigo (`tsup
--watch` reconstruindo `dist/` e o Vite servindo na hora) morreu junto com o `link:`: agora
é `editar o DS → pnpm ds:vendor → commitar o tarball e o lockfile`. Para iterar de verdade
no DS, volte o `link:` temporariamente e desfaça antes de commitar.

O lockfile guarda o sha512 do tarball, então um snapshot novo commitado sem o lockfile
atualizado faz a Vercel falhar na instalação — alto, não silenciosamente com código velho.

## Armadilhas do setup

Três coisas que quebram silenciosamente se mexidas:

1. **`src/styles/index.css` não importa `@guia-da-alma/ds/styles`.** O `dist/styles.css`
   publicado carrega `@source './src'` e `@source './.storybook'`, caminhos que não
   existem dentro de `dist/`. Importá-lo traz os tokens mas o Tailwind nunca varre o JS
   compilado do DS, e os componentes dele renderizam **sem estilo nenhum, sem erro**. Por
   isso importamos só os tokens e fazemos o `@source` para o `dist` por conta própria.
2. **`resolve.dedupe: ['react', 'react-dom']` no `vite.config.ts` é obrigatório.** Sem
   isso o `node_modules` do DS fornece uma segunda cópia do React (18.3.1, contra a 19 do
   app) e todo hook quebra.
3. **O alias `@` usa `fileURLToPath`, não `URL.pathname`.** O nome desta pasta tem acento
   e espaço, que o `pathname` devolve percent-encoded.

## Estrutura

```
src/
  components/
    layout/    sign-up-shell · feature-shell · status-shell · step-shell
    local/     componentes exclusivos deste projeto (ver abaixo)
  flows/<fluxo>/           cadastro/, match/ e agendamento/, mesmo formato
    steps.ts               ordem, slugs, progresso e nodes do Figma
    <fluxo>-provider.tsx   estado mockado do formulário
    screens/               uma tela por passo + registry.tsx
  pages/index-page.tsx     índice das telas, agrupado por fluxo
```

Cada tela ocupa a viewport inteira — não há chrome de revisão em volta, então `min-h-dvh`
vale de verdade. **Não há barra de status do iOS**: os frames do Figma desenham uma, mas ela
foi retirada de todo o protótipo no review — o componente não existe mais, então não é
esquecimento. A navegação é o próprio fluxo, mais o índice em `/`. Para conferir o
mobile, use o modo dispositivo do devtools: media query resolve contra a viewport, então
estreitar uma `div` mostraria o layout **desktop** em largura de celular.

`steps.ts` é a **única** fonte da ordem, do progresso e do mapa passo→node. Acrescentar um
fluxo novo (Login, Home…) é criar `src/flows/<nome>/` no mesmo formato, registrar a rota em
`routes.tsx` e a entrada em `index-page.tsx` — nenhuma tela existente precisa mudar. Foi
exatamente assim que o Match entrou.

As costuras entre fluxos são explícitas: o CTA de `aprovado-screen` (Cadastro) navega para
`/match/inicio`, e o "Ver agenda" de `card-profissional` (Match) para `/agendamento/detalhes`.

### Chrome fixo e conteúdo que desliza

O header, o botão de voltar, a barra de progresso e o rodapé **não são renderizados pelas
telas** — são da rota de layout do fluxo, que o React Router mantém montada entre os passos.
Só o `<Outlet/>` entra em `step-transition.tsx` (pela direita ao avançar, pela esquerda ao
voltar). Se o shell voltasse para dentro da tela, a tela que sai não teria como deslizar
para fora: ela é desmontada junto com o próprio contêiner da animação.

Consequência prática ao criar uma tela: ela renderiza `StepBody` (ou `SignUpBody`), **não**
o shell. `stepLabel`, `progress` e `wide` vêm do `steps.ts` via layout. Duas coisas que a
tela decide mas que aparecem no chrome viajam por `step-chrome.tsx`:

- **rodapé** — por portal, para os botões continuarem no mesmo subtree React do estado que
  eles leem;
- **progresso dinâmico** — `progress` no `StepBody`, só onde a barra depende da resposta
  (50→60 ao escolher horário, 75→85 ao preencher o CPF).

### Altura da tela e o teclado

Não use `min-h-dvh`. No iOS o teclado **não** encolhe o viewport de layout, então `dvh`
continua medindo a tela inteira enquanto só uma faixa está visível — o rodapé cai atrás do
teclado e a página vira rolável só para alcançar o botão de ação.

`lib/use-viewport-height.ts` publica `visualViewport.height` em `--app-height`, e há duas
utilidades:

- **`h-app`** (altura definida) para telas que fixam rodapé e rolam por dentro — os dois
  shells de formulário e o detalhe da sessão. `min-height` não serve aqui: é só um piso, o
  conteúdo continua empurrando a caixa e a área `flex-1` nunca encolhe.
- **`min-h-app`** para as demais, que crescem e rolam com a página.

Quem usa `h-app` precisa de duas coisas a mais:

- `min-h-0` em toda a cadeia flex até o contêiner de rolagem, senão o item flex não encolhe
  abaixo do conteúdo.
- `useLockedDocumentScroll`, que impede o documento de rolar. Sem isso o iOS rola a
  **página** para revelar o campo em foco e arrasta header, botão de voltar e barra de
  progresso para debaixo da barra de status. Com o documento travado, quem rola é a nossa
  área de conteúdo.

`use-viewport-height` também traz o campo em foco de volta à vista depois do resize: o iOS
revela o campo *antes* de a tela encolher, então sem isso ele sai de vista de novo assim que
o layout assenta.

Cor do chrome do navegador: `lib/use-screen-surface.ts`. Cada shell (e cada tela de sangria
total) declara seu token de superfície, e o hook espelha a cor resolvida no `background` do
`<html>` e na meta `theme-color` — que é de onde o Safari no iOS tinge a barra de status e a
barra de endereço. Sem isso o documento fica branco por trás e aparecem as faixas duras em
cima e embaixo. Ao criar uma tela nova de fundo próprio, chame o hook.

A barra que avança está em `lib/use-advancing-progress.ts`: guarda o valor anterior de cada
fluxo em escopo de módulo, porque o shell desmonta ao sair do fluxo e não há pai comum que
sobreviva a isso.

`step-shell` é o shell com barra de progresso, usado por **dois** fluxos — em Figma ele se
chama `mobile-match`/`desktop-match`, mas o "match" ali é o nome do símbolo, não do fluxo.

## DS vs local

Vem do `@guia-da-alma/ds`: `Button`, `IconButton`, `Badge`, `Checkbox`, `InputField`,
`Textarea`, `ProgressBar`, `FeaturedIcon`, `GuiaDaAlmaLockup`/`Symbol`, `cn`,
`ThemeProvider`.

Fica em `components/local/` o que é exclusivo deste projeto — a mesma fronteira que existe
no Figma entre a biblioteca compartilhada e os componentes locais do arquivo Colaborador:

- Cadastro: `company-code-input` (o OTP de 6 dígitos, `company-code-identifier` lá),
  `gradient-backdrop`, `assinatura-consciente`, `ios-status-bar`, `guia-lockup`.
- Match: `guia-orb` (o `Guia_Assistente` animado), `option-card`, `choice-chip`,
  `card-profissional`.
- Agendamento: `month-calendar`, `card-review`, `card-outra-sessao`, e
  `profissional-resumo`, extraído para não triplicar entre Match e Agendamento.
- Transversais: `field-shake` (tremor do campo em erro), `password-strength`,
  `pular-match-button` (o botão com o modal de confirmação).

`option-card`, `choice-chip` e `month-calendar` existem porque o DS não tem equivalente —
itens 16, 18 e 23 do [DS-GAPS.md](DS-GAPS.md). São os candidatos mais fortes a subir para a
biblioteca.

## Regras ao construir uma tela

- **Nunca traduza raio pelo nome do token — nem pelo fallback da exportação.** As escalas
  estão deslocadas (`radius/lg` do Figma é 12px, `rounded-lg` do DS é 8px), e o mesmo nome
  aparece ligado a valores diferentes dentro do arquivo: `radius/xl` é 16px no card de opção
  do Match e 12px na aba do Agendamento. Só o `cornerRadius` real do nó é confiável — leia
  com `use_figma`. Itens 9 e 26 do [DS-GAPS.md](DS-GAPS.md).
- **Nunca leia texto pelo nome da camada.** O arquivo tem drift de cópia — toda barra de
  progresso se chama "Etapa 1 de 4: Empresa" e todo rótulo se chama "Sua empresa",
  independente do que a tela mostra. Leia o texto renderizado.
- **Mobile e desktop são designs diferentes**, não um reflow. Tipografia, alinhamento e
  até as cores mudam entre breakpoints (o Welcome desktop é invertido). Sempre puxe o
  `get_design_context` dos dois nodes.
- **`get_metadata` mente sobre algumas telas** — devolve frame vazio para os dois Welcome
  e os dois "Em análise". Nessas, só `get_design_context` + screenshot.
- Sem valor arbitrário onde existe token. `grep -rn '#[0-9a-fA-F]\{6\}' src` só deve bater
  em comentários.
- Divergência entre DS e Figma: use a variante mais próxima do DS, marque `// DS-GAP:` no
  código e registre no `DS-GAPS.md`. Não mascare com `className`. A única exceção aberta
  até agora está no Welcome desktop (item 12), onde seguir a regra deixaria um botão
  ilegível.

## Verificar

```bash
pnpm build          # tsc -b && vite build
```

Percorrer o fluxo inteiro em ~393px e ~1440px conferindo cada tela contra o
`get_screenshot` do node em `steps.ts`, e abrir cada URL de passo direto (deep-link frio)
para confirmar que renderiza sozinha.
