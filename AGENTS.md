# Protótipo Colaborador UI

App React navegável que reproduz os fluxos do Figma
[Colaborador UI](https://www.figma.com/design/mHWlzkeyvbLscICaXIjkcG/Colaborador-UI),
com estados mockados e sem backend:

- **Cadastro** — seção `266:4`, página `266:3`. 9 telas, do splash ao perfil aprovado.
- **Match de terapia** — seção `791:1078`. 5 telas, que continuam direto do "Perfil
  aprovado": questionário e sessões recomendadas. Eram 7 até a revisão de 21/09/2026, que
  tirou a espera "Buscando sessões" do arquivo.
- **Agendamento** — seção `1184:5843`. 5 telas, que continuam do "Ver agenda" nas sessões
  recomendadas: detalhe da sessão, data e horário, dados e confirmação.
- **Avaliação** — página `1769:9713`, seção `2288:12017`. 8 telas, abertas por "Entrar na
  sala" de uma sessão marcada: sessão realizada, quatro perguntas e um de três finais.

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
    layout/    sign-up-shell · feature-shell · status-shell · step-shell · nav-shell ·
               feedback-shell
    local/     componentes exclusivos deste projeto (ver abaixo)
  flows/<fluxo>/           cadastro/, match/, agendamento/, avaliacao/, diario/ e
                           introducao/, todos no mesmo formato
    steps.ts               ordem, slugs, progresso e nodes do Figma
    <fluxo>-provider.tsx   estado mockado do formulário
    screens/               uma tela por passo + registry.tsx
  shell/                   o app depois do onboarding — destinos, não passos
    destinos.ts            rótulos, ícones, nodes, o que ainda não existe e o que é perfil
    catalogo.ts            o que a Busca procura
    shell-route.tsx        rota de layout com o nav-shell
    screens/               uma tela por destino + registry.tsx
  state/conta-provider.tsx estado de conta, acima do router
  pages/index-page.tsx     índice das telas, app e fluxos
```

### Fluxos e destinos são coisas diferentes

Um **fluxo** (`src/flows/<nome>/`) é linear: tem ordem, progresso e um "próximo". Um
**destino** (`src/shell/`) não tem nenhum dos três — tem entrada de menu. Por isso
`destinos.ts` é para o shell o que `steps.ts` é para um fluxo: a fonte única de rótulo,
ícone, node do Figma e de quais destinos já existem. O que está no menu e não foi desenhado
(o Diário) fica lá com `disponivel: false`, aparece com a cara do desenho e não
navega — esconder seria dar uma informação errada sobre o menu.

As rotas dos destinos vivem sob `/app/`, o que evita a colisão entre `/agendamento` (o
fluxo, uma tarefa) e `/agendamentos` (o destino, uma lista).

`state/conta-provider.tsx` fica **acima do router**, em `app.tsx`, porque é a única coisa
que precisa sobreviver à troca de fluxo: concluir o Agendamento registra a sessão, e é isso
que faz o Início trocar o banner do Match por "Sua próxima sessão" e preencher Meus
agendamentos. Provider de fluxo é desmontado na saída e não serviria.

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

### Destino fora do menu, e o topo de cada tela no mobile

Nem todo destino tem entrada de menu. "Meus dados" (`2873:3`) se abre pelo perfil, e "Seu mês
em detalhes" (`2809:613`) e o aviso da escala (`2862:2246`) são sub-páginas do Diário. Quem
diz isso é o Figma: a régua dessas telas vem com `Item ativo=Nenhum`, descrito como "para
telas abertas fora do menu (ex.: Meus dados, acessada pelo perfil)". Elas são destinos em tudo
o mais — rota sob `/app/`, sem ordem, sem progresso e sem "próximo" — e ficam marcadas com
`foraDoMenu: true` em `destinos.ts`, que as tira das duas listas de menu (`destinosNoMenu`).

Separado disso, no mobile **a barra inferior só aparece nos três destinos que ela lista**
(`noMobile`), porque é só neles que os frames a desenham. Os outros trazem no topo o que o
frame deles traz: o botão de menu no Meu diário, o de voltar em Meus pontos e em Meus dados.
Quem decide é o `barraInferior` do `NavShell`, no `shell-route`. As portas de "Meus dados" são
o rodapé da régua no desktop e a folha do menu no mobile, onde não há perfil desenhado.

### O Diário: um destino, duas sub-páginas e um fluxo

"Meu diário" é um destino com dois estados no arquivo — vazio (`2845:2287`) e com registros
(`2813:19777`) —, e aqui é um só, escolhido pela quantidade de registros na conta, do mesmo
jeito que o Início troca de cara quando há sessão marcada. Como `sessoes`, `registros` começa
vazio: o protótipo abre no estado vazio e é registrar que enche a lista, o insight do mês e
"Seu mês em detalhes".

O **Registro de humor** (`src/flows/diario/`) é o fluxo de cinco passos que grava um registro,
e o que ele grava só chega à conta no passo 3, em "Registrar" — sair antes não deixa nada, que
é o que "Deixar para depois" promete. O primeiro passo é o único do protótipo desenhado sobre
`surface/muted`, e isso vem do `steps.ts` (`superficie`), não da tela.

O orbe animado é `components/local/orbe-humor.tsx`, alimentado pela receita
`assets/diario/blend.json`. Ele nasceu como experimento em `/experimentos/diario-humor`, que
deixou de existir quando o desenho chegou: a rota e a pasta `src/experiments/` foram removidas.

### Costuras: quem abre um fluxo diz para onde voltar

As costuras são explícitas: o CTA de `aprovado-screen` (Cadastro) navega para `/match/inicio`,
o "Ver agenda" de `card-profissional` (Match **e** Busca) para `/agendamento/detalhes`, o
"Reagendar" de `detalhes-sessao` para `/agendamento/horario`, e o "Continuar" de
`agendada-screen` fecha o ciclo em `/app/agendamentos`. "Entrar na sala" de `detalhes-sessao` abre
`/avaliacao/realizada` — não há sala, então o protótipo pula a sessão —, e os horários dos finais
da Avaliação voltam para `/agendamento/horario` com o dia e a hora já escolhidos, por router state
(`slot`), que o `agendamento-provider` lê no inicializador junto com `disponibilidade`.

O mesmo fluxo é alcançável de mais de um lugar, e um deles é o app. Por isso quem abre passa a
**origem** em `lib/origem.ts`, e o fluxo devolve a pessoa para lá: `comOrigem()` na saída,
`lerOrigem(search, padrao)` na volta. Vai na **query string**, não em router state — os fluxos
já anexam `search` a cada navegação de passo, e router state não sobrevive a isso (é por essa
mesma razão que `agendamento-provider` lê `disponibilidade` uma única vez no inicializador).
O `padrao` é sempre o comportamento anterior, para deep-link frio não mudar.

Sem isso, agendar pela Busca e apertar voltar deixava a pessoa no meio do questionário do
Match. Ao acrescentar uma porta nova para um fluxo, passe a origem — e ao ler o retorno, nunca
fixe um caminho de onboarding no código.

### Chrome fixo e conteúdo que desliza

O header, o botão de voltar, a barra de progresso e o rodapé **não são renderizados pelas
telas** — são da rota de layout do fluxo, que o React Router mantém montada entre os passos.
Vale igual para o `nav-shell`: a barra inferior e a régua lateral ficam na rota de layout do
`/app`. Só o conteúdo do passo entra em `step-transition.tsx`. Se o shell voltasse para
dentro da tela, a tela que sai não teria como deslizar para fora: ela é desmontada junto com
o próprio contêiner da animação.

**A tela é resolvida pelo layout, pelo registry — nunca por um `<Outlet/>` dentro da
animação.** Cada layout casa `/<fluxo>/:step` direto, sem rota filha, e faz
`screenComponents[step.slug]`. O motivo é específico e custou um bug: o `AnimatePresence`
guarda o elemento que está saindo e o re-renderiza durante a saída, e um `Outlet` (ou
qualquer componente que leia `useParams`) resolve a rota **atual** nessa hora. O elemento que
devia estar saindo passava a mostrar a tela nova — a pessoa via a tela aparecer, sair e
aparecer de novo. Ao acrescentar um fluxo, siga o mesmo formato: rota `:step` no layout,
tela pelo registry.

Consequência prática ao criar uma tela: ela renderiza `StepBody` (ou `SignUpBody`), **não**
o shell. `stepLabel`, `progress` e `wide` vêm do `steps.ts` via layout. Duas coisas que a
tela decide mas que aparecem no chrome viajam por `step-chrome.tsx`:

- **rodapé** — por portal, para os botões continuarem no mesmo subtree React do estado que
  eles leem;
- **progresso dinâmico** — `progress` no `StepBody`, só onde a barra depende da resposta
  (50→60 ao escolher horário). O 75→85 do Agendamento morreu junto com o campo de CPF, que
  saiu do fluxo em 21/09/2026 — ver SYNC-FIGMA.md.

### Rolagem e cabeçalho

A página rola normalmente — nada de altura fixa, contêiner de rolagem interno ou trava de
documento. O que fica parado é só o cabeçalho do passo (botão de voltar + barra de
progresso), que é `sticky top-0` no mobile e volta a `static` no desktop.

Isso é uma decisão deliberada, tomada depois de várias tentativas de manter o botão de ação
acima do teclado no iOS. Cada abordagem — dimensionar pelo `visualViewport`, travar a
rolagem do documento, acompanhar o deslocamento do viewport visual — corrigia uma camada e
revelava outra. Com o teclado aberto a página simplesmente rola, e a pessoa rola até o
botão. **Não reintroduza `100dvh` fixo, `overflow: hidden` no body nem cálculo de altura por
`visualViewport` aqui sem testar em aparelho real.**

**Armadilha:** `pt-safe`, `px-safe` e `pb-safe` são CSS escrito *depois* do Tailwind em
`styles/index.css`, então no mesmo elemento elas **ganham** de `pt-24`, `px-6`, `pl-[280px]`
e afins — sem erro e sem aviso, o padding simplesmente some. As três aceitam o valor próprio
por variável: use `[--pt-safe:6rem]`, `[--px-safe:1.5rem]`, `[--pb-safe:1rem]` em vez da
utility de padding, ou ponha o padding num elemento interno. Isso já custou três bugs.

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

### Avaliação: página no mobile, modal no desktop

O fluxo de Avaliação usa o `feedback-shell`, não o `step-shell`: no mobile é uma página inteira
com "Pergunta N de 4" em segmentos; no desktop é um modal de 560px **sobre a tela do app de onde
veio**, com a régua. Esse fundo é a tela de verdade (`shell/screens/registry.tsx`), montada só no
desktop e `inert` — por isso o layout lê o breakpoint em JS. O rodapé é `flex-row-reverse` no
desktop: as telas põem a ação primária primeiro e ela vai para a direita.

O fim não é linear: `steps.ts` só dá a ordem da animação e do índice, e quem escolhe o final é
`finalDaAvaliacao` no provider (nota ≤ 3 ou chamada com problema sério → `apoio`). Os pulos vão
direto a `proxima`. Decisões sem desenho no arquivo estão no SYNC-FIGMA.md.

### Duas colunas no desktop do Agendamento

O `StepShell` tem um prop `aside`: com ele, o desktop vira a grade de duas colunas em que o
Agendamento é desenhado — 1000px centrados, 436 + 80 + 436 dentro de 24 de padding. O mobile
não muda, porque lá não existe segunda coluna. O botão de voltar acompanha: no desktop ele
fica no topo da coluna esquerda, e o da linha da barra de progresso some.

Quais passos são de duas colunas está em `steps.ts` (`split: true`), não no código da tela —
mesma regra de sempre. Vale para os dois conjuntos de frames, o de onboarding (`1279:*`) e o
"com menu" (`1617:*`); "Confirmar informações" é coluna única nos dois, e `detalhes` desenha a
sua própria porque a divisão dele é outra.

A coluna esquerda é `flows/agendamento/resumo-agendamento.tsx`, e ela **preenche conforme o
estado**: o arquivo desenha todos os blocos em todos os frames e usa opacidade 0/1 para revelar
o que já foi preenchido. Ver SYNC-FIGMA.md.

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
- App (Início, Busca, Agendamentos): `barra-conta` (nível, pontos e moedas),
  `card-sessao` (a sessão já agendada), `detalhes-sessao` (a tela/drawer de uma sessão
  marcada), `promo-match` (o banner escuro do Início sem sessão), `painel-filtro` (a folha de
  filtro da Busca).
- Avaliação: `opcoes-resposta` (as respostas de escolha única), `nota-estrelas`,
  `progresso-perguntas` (os quatro segmentos) e `proximos-horarios` (os três horários dos finais).
- Transversais: `field-shake` (tremor do campo em erro), `password-strength`,
  `pular-match-button` (o botão com o modal de confirmação).

`option-card`, `choice-chip`, `month-calendar` e agora o `nav-shell` existem porque o DS não
tem equivalente — itens 16, 18, 23 e 31 do [DS-GAPS.md](DS-GAPS.md). São os candidatos mais
fortes a subir para a biblioteca.

Cuidado com dois nomes parecidos: `card-profissional` é o cartão de resultado (título da
sessão, avaliação, disponibilidade, "Ver agenda"), usado pelo Match e pela Busca;
`card-sessao` é o cartão de sessão já marcada (badge de data, "Ver detalhes"), usado pelo
Início e por Meus agendamentos. No Figma os dois se chamam `card-profissional` e não têm
quase nada em comum.

E com dois "detalhes da sessão": o passo `detalhes` do fluxo de Agendamento (1184:5171) é o que
se lê **antes** de marcar, e termina em "Agendar com Daniele"; `detalhes-sessao` (1776:3 e
1784:30, página "Sessão") é o de uma sessão **já** marcada, e termina em "Entrar na sala".
Mandar um botão do app para o primeiro é o bug que essa distinção existe para evitar.

## Regras ao construir uma tela

- **`text-label-*` e `text-body-*` não são intercambiáveis, e o token não te protege.**
  Nenhum token de tipografia do DS carrega `font-weight`. Como `label-s` e `body-s` têm o
  mesmo tamanho e a mesma altura de linha (14/20), e o mesmo vale para `label-m`/`body-m`
  (16/24), o **peso é a única diferença** — e era justamente o que faltava: `text-label-s`
  herdava 400 e todo Label do protótipo renderizava com cara de Body, sem erro e sem aviso.
  O `styles/index.css` redefine as seis utilities via `@utility` com o peso dentro (Label
  600, Body e Caption 400). Não acrescente `font-semibold` avulso para compensar, e ao pegar
  um estilo no Figma leia o peso junto do tamanho. Item 43 do [DS-GAPS.md](DS-GAPS.md).
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
