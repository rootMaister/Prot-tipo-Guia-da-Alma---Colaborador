# Relatório de lacunas — `@guia-da-alma/ds`

Achados de consumir o design system como **primeiro app real** do pacote (até agora o único
consumidor era o Storybook, que importa do código-fonte e por isso não exercita nenhum destes
caminhos). Protótipo: fluxo de Cadastro do Colaborador UI.

Cada item diz como foi verificado. Nada aqui é suposição.

---

## 1. `IconButton` e os logos estavam construídos mas não exportados — CORRIGIDO

**Severidade:** alta (impedia o uso)

`IconButton` existe completo em `src/components/icon-button/icon-button.tsx`, com seu próprio
`index.ts`, mas nunca foi ligado ao barrel `src/index.ts`. O mesmo vale para
`GuiaDaAlmaSymbol` / `GuiaDaAlmaWordmark` / `GuiaDaAlmaLockup`, em
`src/components/nav-bar/guia-da-alma-logo.tsx`.

Como o `exports` do `package.json` só expõe `.`, `./styles` e `./tokens`, não há subpath para
contornar: `import { IconButton } from '@guia-da-alma/ds'` simplesmente falhava. O Cadastro
precisa dos dois — a seta de voltar aparece em 4 telas e o lockup em todas as versões desktop.

Contraria a regra do próprio DS (`.ai/rules/structure.md`): *"every new component must be
exported there with its types"*.

**Status:** corrigido no branch `update-components-colaborador` do design-system, com changeset
(`.changeset/wild-pugs-shake.md`). **Não commitado** — está no working tree para sua revisão.

**Ainda sem export** (não usados pelo Cadastro, ficam como registro): `Popover` / `PopoverTrigger`
/ `PopoverContent` / `PopoverAnchor` / `PopoverClose`, `NavBar` (+ `NavBarProps`, `NavBarItemKey`,
`DESKTOP_WIDTH_EXPANDED`, `DESKTOP_WIDTH_COLLAPSED`), `WeekCalendar` / `MonthCalendar` /
`DayCalendar`, `DatePickerPanel`, `ToasterProps`, `ProgressBarProps`.

O `NavBar` é o mais relevante para as próximas fatias do app (Home, Busca, Agendamento), já que
é o shell de navegação — vai bloquear a próxima entrega do mesmo jeito.

---

## 2. Os tokens de duração de motion não geram utilitário nenhum — silenciosamente

**Severidade:** média (bug visual silencioso, já em produção)

`src/tokens/spacing.css` define cinco durações:

```css
--duration-instant: 0ms;  --duration-fast: 120ms;  --duration-normal: 200ms;
--duration-slow:    320ms; --duration-slower: 480ms;
```

`--duration-*` **não é um namespace reservado do Tailwind v4**, então essas variáveis compilam
como custom properties inertes e a classe `duration-fast` não emite CSS nenhum — sem erro, sem
aviso.

**Verificado assim:** no CSS gerado pelo build do protótipo, `.duration-fast` e a própria
custom property `--duration-fast` estão ausentes, enquanto `--ease-standard` e `.ease-standard`
estão presentes (`--ease-*` é reservado). Ou seja, os tokens de easing funcionam e os de duração
não — o par sempre foi usado junto.

**Impacto:** `Button` e `IconButton` aplicam `duration-fast ease-standard`. Sem a duração, a
transição resolve para a duração padrão do shorthand `transition` (`0s`) e **não anima** — o
hover dos botões é instantâneo, não suave.

É exatamente o modo de falha que o `.ai/rules/styling.md` do próprio DS documenta: *"a
non-reserved name compiles as an inert custom property and silently emits no class — this bug
actually shipped and was fixed in 0.1.9"*. O mesmo bug voltou, agora nas durações.

**Não proponho a correção sem testar:** o namespace certo do Tailwind v4 para durações nomeadas
precisa ser confirmado empiricamente antes de mexer.

---

## 3. `dist/styles.css` publica `@source` que não existem no pacote

**Severidade:** alta (quebra silenciosa para qualquer consumidor)

O `tsup.config.ts` gera `dist/styles.css` a partir de `tailwind.css` substituindo **só** o import
de tokens. O resultado publicado é:

```css
@import 'tailwindcss';
@source './src';          /* não existe dentro de dist/ */
@source './.storybook';   /* não existe dentro de dist/ */
@plugin 'tailwindcss-animate';
@import './tokens/index.css';
```

Quem seguir o README e fizer `@import '@guia-da-alma/ds/styles'` recebe os tokens, mas o Tailwind
**nunca varre o JS compilado do DS** — nenhuma classe usada *dentro* dos componentes é gerada e
eles renderizam sem estilo, sem erro nenhum.

**Contorno adotado no protótipo** (`src/styles/index.css`): não importar `/styles`, e sim os
tokens + um `@source` próprio apontando para o `dist` do pacote:

```css
@import 'tailwindcss';
@plugin 'tailwindcss-animate';
@source '../../node_modules/@guia-da-alma/ds/dist';
@import '@guia-da-alma/ds/tokens';
```

**Verificado que o contorno funciona:** classes que só existem dentro dos componentes do DS
aparecem no CSS gerado — `size-\[42px\]` (IconButton), `scale-\[0\.97\]` (Button),
`text-label-s`, `bg-outline-subtle`, `ease-standard`.

**Correção sugerida no DS:** o `onSuccess` do tsup deveria reescrever os `@source` para `'./'`
(ou removê-los e deixar o consumidor apontar), não só o import de tokens.

---

## 4. `tailwindcss-animate` é devDependency, mas o CSS publicado faz `@plugin` dele

**Severidade:** média

`dist/styles.css` (e `tailwind.css`) declaram `@plugin 'tailwindcss-animate'`, mas o pacote está
em `devDependencies`. Um consumidor que não o instale por conta própria quebra no build de CSS.
Deveria ser `dependencies` ou `peerDependencies`.

O protótipo instala explicitamente para contornar.

---

## 4b. `Badge` e `ProgressBar` divergem do que o Figma desenha

**Severidade:** baixa (fidelidade visual)

**`Badge`** — as cores batem: `variant="success"` usa `category-green-surface` / `-text`, os
mesmos `#ecfaca` / `#466700` do badge de porcentagem no Figma. O resto não:

| | DS | Figma |
|---|---|---|
| padding horizontal | `px-4` (16px) | 12px (`space/component/md`) |
| tamanho de fonte | `text-xs` (12px) | 14px (`Label/Label S`) |
| peso | `font-bold` (700) | semibold (600) |

**`ProgressBar`** — o preenchimento usa `bg-action-primary` (#1c2e17), igual ao Figma. Mas o
trilho é `bg-outline-subtle` (#e5e5e5) enquanto o Figma o vincula a `surface/muted` (#edebe7).

Conforme combinado, os dois foram usados como o DS os renderiza, sem override de `className`.

---

## 5. `GuiaDaAlmaLockup` é inutilizável com qualquer `className`

**Severidade:** alta — quebra visível, não sutil (reclassificada: eu tinha estimado "baixa"
na leitura do código; o print mostrou o contrário)

```tsx
export function GuiaDaAlmaLockup(props: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-1.5">
      <GuiaDaAlmaSymbol className="h-[21px] w-auto shrink-0" {...props} />
      <GuiaDaAlmaWordmark className="h-[15px] w-auto shrink-0" {...props} />
    </div>
  )
}
```

O tipo é `SVGProps<SVGSVGElement>`, mas o elemento raiz é uma `div` que não recebe prop nenhuma;
e o mesmo `props` é espalhado nos **dois** SVGs *depois* do `className` deles. Qualquer
`className` que o consumidor passe — **inclusive só uma cor** — apaga `h-[21px] w-auto` do
símbolo e `h-[15px] w-auto` do wordmark, e ambos assumem o tamanho do caller. Só funciona sem
prop nenhuma.

**Confirmado em tela.** Todas as 5 utilizações no protótipo saíram quebradas: no splash o
símbolo virou um ícone gigante de 188px com o wordmark transbordando ao lado; no Welcome
desktop, símbolo e wordmark ficaram separados por um vão de ~150px. Eu tinha previsto o bug
lendo o código e classificado como severidade baixa — errado; só o screenshot mostrou o
tamanho do estrago.

**Contorno:** `src/components/local/guia-lockup.tsx` compõe `GuiaDaAlmaSymbol` +
`GuiaDaAlmaWordmark` diretamente. Os dois componentes individuais aceitam `className`
normalmente; só o lockup composto é que está quebrado.

**Nota de geometria:** ao compor, descobri que o DS também erra a proporção. Ele dimensiona o
wordmark a 15/21 da altura do símbolo, mas o Figma desenha o lockup a 188×26, 130×18 e 240×33
ao longo do fluxo — e em **todos** símbolo e wordmark têm a mesma altura (a largura sai em
~7,06× a altura). O contorno local segue o Figma.

**Correção sugerida:** tipar como `HTMLAttributes<HTMLDivElement>`, aplicar `className` na `div`
raiz, não espalhar props nos filhos, e igualar as alturas.

---

## 6. Dark mode declarado mas não implementado

**Severidade:** informativa

`ThemeProvider` alterna a classe `.dark`, mas `src/tokens/colors.css` termina com
`/* Dark mode — full dark palette is deferred */` e não define nenhuma cor sob `.dark` — só
`shadows.css` tem override. Alternar o tema não muda as cores. O protótipo é light-only.

---

## 7. Documentação desatualizada

**Severidade:** baixa

- `README.md` § "Consuming the Package" cita "23 components", exporta `useAlert` (não existe),
  lista `MonthCalendar` e `Popover` como disponíveis na raiz (não estão), nomeia grupos de token
  que não existem mais (`text-text-primary`, `border-border-default`, `surface-default`) e diz
  que as fontes são Poppins/DM Sans — são **Calma Serif / Inter Tight**.
- `README.md` aponta para `.ai/CONVENTIONS.md`, `.ai/STRUCTURE.md`, `.ai/MIGRATION.md`, que não
  existem (o real é `.ai/rules/*.md`).
- `package.json` tem o script `test:release-readiness` apontando para `src/__tests__`, que não
  existe.

---

## 8. `Button` deixa um `disabled` explícito anular o próprio estado de loading — CORRIGIDO

**Severidade:** média (bug de comportamento)

```tsx
({ variant, size, leadingIcon, trailingIcon, isLoading, className, children, ...props }, ref) => (
  <button
    disabled={isLoading || props.disabled}
    {...props}          // ← `disabled` continua dentro de props e sobrescreve a linha acima
  />
)
```

`disabled` não é desestruturado, então continua em `props` e o spread — que vem **depois** —
sobrescreve o valor calculado. Consequência: `<Button isLoading disabled={false}>` renderiza um
botão **habilitado durante o loading**, clicável. Só não aparece quando o consumidor omite
`disabled` por completo, porque aí a chave não existe em `props`.

O `IconButton` faz certo (`{ icon, isLoading, className, disabled, ...props }` — `disabled` sai
de `props`), o que mostra que é um deslize pontual, não um padrão.

**Status:** corrigido no branch `update-components-colaborador`, com changeset
(`.changeset/tidy-melons-invite.md`). `disabled` passou a ser desestruturado, como o
`IconButton` já fazia. **Não commitado.**

**Onde aparecia no protótipo:** `empresa-screen.tsx`, que passa `disabled` e `isLoading`
juntos — a marcação `DS-GAP` já foi removida de lá.

---

## 14. O hover da variante `text` do `Button` usa o token errado — ⏳ PENDENTE (você resolve)

**Severidade:** média (divergência visual em todo botão de texto)
**Status:** não corrigido, por decisão sua. O protótipo segue com o comportamento atual do DS.

Inspecionando o component set `button` (`23635:328`) na UI Kit v2, variante `Text`, tamanho
`Large`, estado a estado:

| Estado | Fundo no Figma | Rótulo no Figma |
|---|---|---|
| Default | nenhum | `action/tertiary` #1c2e17 |
| **Hover** | **`action/tertiary-hover` #dbefc4** | `action/tertiary` #1c2e17 |
| Focused | nenhum | `action/tertiary` #1c2e17 |
| Disabled | nenhum | `fg/disabled` #858585 |
| Loading | nenhum | `action/tertiary` #1c2e17 |

O código faz:

```
text: 'bg-transparent text-action-tertiary font-bold
       hover:bg-action-primary-subtle      ← #f7fbf6, não existe no Figma
       active:bg-action-tertiary-hover'    ← #dbefc4, é a cor de HOVER do Figma
```

Ou seja: **a cor de hover do design foi parar no estado `active`, e o hover ganhou um
`action/primary-subtle` que o componente do Figma não usa em estado nenhum.**

Que é um deslize e não convenção fica claro na variante vizinha: `Text Neutral` usa
`hover:bg-action-neutral-hover`, que **bate** com o Figma (`action/neutral-hover` #cccccc). Só a
`text` está trocada.

**Correção:** `hover:bg-action-tertiary-hover` na variante `text`. O estado `active` não existe
no componente do Figma, então é decisão de produto o que fazer com ele.

---

## 12. Não existe variante de `Button` para fundo escuro — e aqui eu quebrei a regra

**Severidade:** alta (deixa a tela inutilizável se seguida à risca)

O Welcome desktop (826:3162) tem um botão de texto sobre o painel verde-escuro, com o rótulo em
`fg/on-action` (#ecfaca). Nenhuma variante do `Button` renderiza texto claro sobre fundo escuro:

| Variante | Cor do texto |
|---|---|
| `text` | `action/tertiary` #1c2e17 |
| `text-neutral` | `action/neutral` #434343 |

As duas ficariam **invisíveis** sobre o #1c2e17 do painel.

**Aqui eu abri exceção à regra de "sem override de className".** Usei
`<Button variant="text" className="text-fg-on-action">`. A regra existe para expor lacunas, não
para esconder; mas neste caso segui-la à risca entregaria um botão ilegível numa das duas telas
de entrada do protótipo, o que atrapalha mais a revisão do que ajuda.

**O design faz exatamente o mesmo.** Inspecionando o nó `826:3162` no arquivo Colaborador: é uma
instância de `button` com `Variant=Text, State=Default, Size=Large` e **2 overrides**, um deles
em `fills` — o rótulo foi fixado à mão em `fg/on-action` (#ecfaca) na instância. Ou seja, o
designer recorreu ao mesmo atalho, que é justamente o que as regras do pack de
design-constraints proíbem ("nunca hardcode numa instância; uma aparência que o componente não
produz é lacuna do DS"). Meu override espelha o do design — não é invenção minha, mas também não
é solução.

**Correção incompleta, e eu descrevi como se fosse completa.** Forcei só a cor do texto; o
**hover continua o da variante clara**. Depois da correção do item 14 ele fica `#dbefc4` (lime
claro) — melhor que o quase-branco de hoje, mas ainda um bloco claro sobre o painel escuro. A
matriz de estados para fundo escuro continua sem resposta.

**Correção sugerida:** uma variante `text-on-brand` (ou um prop `onDark`) no `Button`. O token
`fg/on-action` já existe. Vale também para o `IconButton`, que tem o mesmo problema.

---

## 15. A Calma Serif só tem o peso Regular — negrito em display era sintetizado

**Severidade:** baixa (corrigido no protótipo)

`src/assets/fonts/calma serif/` do design system contém apenas `CalmaSerif-Regular` (woff2,
woff, otf). Não há arquivo SemiBold. O `fonts.css` declara um único `@font-face` com
`font-weight: 400`.

Eu vinha aplicando `font-semibold` em texto de display em três lugares (o título do
`sign-up-shell` no desktop, o do Welcome desktop e os dígitos do `company-code-input`). Sem um
arquivo mais pesado, o navegador **sintetiza** um falso-negrito — engrossa os traços
artificialmente e desconfigura o desenho da serifada.

**Isso também divergia do design.** As saídas do `get_design_context` mostram
`Heading/Heading XXL: Font(..., style: typography/font-weight/semibold, weight: 400, ...)` — a
variável do Figma se chama "semibold" mas resolve para **400**, porque a família não tem nada
mais pesado. E o `tokens.md` do pack lista os 8 estilos de Calma Serif como `Regular`. Ou seja,
o design já renderiza em 400; o falso-negrito era invenção do meu código.

**Corrigido:** os três `font-semibold` foram removidos, e `src/styles/index.css` passou a
declarar `.font-display { font-synthesis-weight: none }` — assim, se alguém reintroduzir um
utilitário de peso, o navegador não finge: o texto continua no traço real da fonte.

**Pendência do lado do DS:** se a marca tiver um Calma Serif SemiBold, vale adicioná-lo à
biblioteca; hoje qualquer peso acima de 400 em display é impossível de representar.

---

## 13. Divergências menores acumuladas nas telas de status e sucesso

**Severidade:** baixa

- **`FeaturedIcon size="xxl"`** dá o contêiner certo de 80px, mas o glifo sai com 40px onde o
  Figma desenha 36px. `xxl` já é o maior tamanho disponível, então não há como acertar.
- **Botão "Acesse a central de ajuda"** (tela Em análise): o Figma usa `fg/subtle` (#6e6e6e)
  semibold; a variante mais próxima, `text-neutral`, é `action/neutral` (#434343) bold.

---

## 10. `InputField` não tem `required` — não há como marcar campo obrigatório

**Severidade:** média

O Figma marca os campos obrigatórios da tela de dados pessoais com asterisco vermelho
(`fg/required`, #c1442e), e o `input-field` de lá tem um booleano `Required` que o renderiza —
o pack de design-constraints inclusive avisa "don't hand-type '*'".

O `InputFieldProps` do DS é só `{ id?, label?, helperText? }` mais os props nativos do input.
Não há `required` visual: passar o `required` do HTML não muda nada na aparência.

**Contorno no protótipo:** o asterisco entrou no texto do `label` (`"Nome completo *"`). Passar
conteúdo é do consumidor; o que não fiz foi forçar a cor com `className`. Resultado: o asterisco
sai na cor do label (`fg-muted`), não em vermelho.

**Correção sugerida:** um prop `required?: boolean` no `InputField` que renderize o asterisco em
`text-fg-required` — o token já existe.

---

## 11. `InputField` mostra o erro em `fg-on-error`, que é o token errado

**Severidade:** baixa

```tsx
{error ? <p className="text-fg-on-error text-caption">{error}</p> : ...}
```

`fg/on-error` (#953221) é a cor de texto **sobre** uma superfície de erro. A mensagem aqui está
sobre `surface/base`, então o token correto é `fg/error` (#c1442e) — que existe e é o mesmo que
o `Input` já usa na borda (`border-outline-error`).

---

## 9. A escala de raio do DS está deslocada em relação à do Figma, e faltam dois degraus

**Severidade:** média (erro silencioso de fidelidade)

| Variável no Figma | Valor | Classe do DS com o mesmo valor |
|---|---|---|
| `radius/xs` | 2px | — **não existe** |
| `radius/sm` | 4px | `rounded-sm` |
| `radius/md` | 8px | `rounded-lg` |
| `radius/lg` | 12px | `rounded-xl` |
| `radius/xl` | 16px | `rounded-2xl` |
| `radius/xxl` | 24px | — **não existe** |
| `radius/full` | 9999px | `rounded-full` |

Os nomes coincidem mas os valores não: `rounded-lg` no DS é 8px, enquanto `radius/lg` no Figma é
12px. Quem traduzir um design pelo nome do token — o caminho natural — erra por um degrau em
todo elemento, sem nenhum aviso.

Além disso faltam os extremos: 2px e **24px**. O `radius/xxl` (24px) é usado no arquivo do
Colaborador (o card do Diário de humor, por exemplo).

**Onde aparece no protótipo:** as caixas do `company-code-input` são `radius/lg` (12px) no
Figma e portanto `rounded-xl` no código — não `rounded-lg`.

---

## Anexo — divergências no arquivo do Figma (não são lacunas do DS)

Encontradas ao ler as telas, registradas aqui porque afetam o que o protótipo renderiza.

### A1. A barra de progresso e o badge discordam entre si, e entre mobile e desktop

Nas 4 telas com header, comparando o texto renderizado do badge com a largura do preenchimento
da barra:

| Passo | Rótulo renderizado | Badge | Barra mobile | Barra desktop |
|---|---|---|---|---|
| 2 Identificador da empresa | Identifique sua empresa | 6% | 5,7% ✓ | 4,1% |
| 4 Contrato de confiança | Termos de uso e privacidade | **6%** ✗ | 5,7% ✗ | 29,3% |
| 5 Dados pessoais | Informações de contato | 56% | **72,4%** ✗ | 53,4% ✓ |
| 6 Crie uma senha | Configure sua senha | 98% | 97,5% ✓ | 94,8% ✓ |

O badge do passo 4 é cópia literal do passo 2 e ficou para trás; a barra mobile do passo 5
também não acompanhou o badge.

**Resolvido no protótipo:** os badges 6 / 56 / 98 são intencionais e visíveis, então foram
mantidos; só o do passo 4 foi recalculado para **31%** — ponto médio entre os vizinhos
declarados (6 e 56), valor que a barra do desktop (29,3%) corrobora. No código, badge e barra
saem do **mesmo** campo `progress` em `steps.ts`, então não há como divergirem de novo.

### A2. Rótulos das etapas: nome de camada ≠ texto renderizado

Em todas as 4 telas a camada se chama `Progress Bar - Etapa 1 de 4: Empresa` e o nó de texto
filho se chama `Sua empresa`. Nenhum dos dois corresponde ao que a tela mostra — os rótulos
reais são os da tabela acima. É o mesmo problema que o `sync-log.md` do pack de
design-constraints já registrou ("always match on `.characters`, never on layer `name`").

### A3. Frame do desktop do passo 7 com nome errado

`1089:10400` chama-se "[Desktop] 6. Crie uma senha" mas renderiza "Em análise" — é o desktop do
passo 7. Confirmado por screenshot.

---

## O que deu certo sem atrito

Registrado para contrapeso, porque é a maior parte:

- **As fontes viajam com o pacote.** O `tsup` copia `src/assets` → `dist/assets` e o
  `dist/tokens/fonts.css` referencia `../assets/fonts/...`, que resolve. Calma Serif e Inter
  Tight chegam self-hosted, sem o consumidor fazer nada — verificado no build do protótipo, que
  emitiu os `.woff2`/`.woff`/`.otf`/`.ttf` no bundle.
- **Os tokens semânticos cobrem o Cadastro inteiro.** Nenhuma cor, raio ou tipografia da seção
  `266:4` do Figma precisou de valor hardcoded.
- **`Button` bate com o Figma:** `variant="contained"` reproduz o "Contained Dark" (52px, pill,
  `action-primary`) e `variant="lime"` o botão claro do Welcome desktop.
- **`ProgressBar`** tem `h-1` = os 4px do design.
- **`InputField`** já traz o olho de mostrar/ocultar em `type="password"`, que a tela de senha
  precisa.
- **Consumo via `link:` funciona**, com uma ressalva: é obrigatório `resolve.dedupe:
  ['react','react-dom']` no Vite, senão o `node_modules` do design-system fornece uma segunda
  cópia do React (18.3.1, contra a 19.2.8 do app) e todo hook quebra.

---

# Achados do fluxo Match de terapia

Segunda fatia do protótipo (seção `791:1078`). Os itens acima vieram do Cadastro; estes são
novos, e nenhum deles aparece no Cadastro porque aquele fluxo não usa seleção múltipla,
cartões nem avatares.

## 16. Não existe cartão de opção selecionável — o componente mais usado deste fluxo

**Severidade:** alta (bloqueia 3 das 7 telas)

O Match é um questionário: as telas 2, 4 e 5 são feitas de linhas selecionáveis de largura
total — rótulo à esquerda, controle à direita, borda, cantos de 16px, e um estado marcado que
pinta o cartão inteiro de lime. O Figma chama isso de `radio-group-item` (679:805), apesar de
ser checkbox: todas as telas que o usam são de seleção múltipla ("Marque os temas…").

O DS não tem equivalente:

| Componente do DS | O que é |
|---|---|
| `RadioGroupItem` | só o círculo de 16px, sem rótulo nem contêiner |
| `CheckboxField` | linha pequena controle-depois-rótulo, sem borda nem fundo |

**Contorno:** `src/components/local/option-card.tsx`, que compõe o `Checkbox` do DS dentro do
cartão. É o candidato mais forte a subir para o DS — três telas deste fluxo e, pela cara do
arquivo, boa parte de Busca e Agendamento.

## 17. `Checkbox` é fixo em 16px e `rounded-sm`; o Figma desenha 24px e `radius/md`

**Severidade:** média

```tsx
'border-outline-default bg-surface-base peer h-4 w-4 shrink-0 rounded-sm border …'
```

`h-4 w-4` (16px) e `rounded-sm` (4px), sem prop de tamanho. O Figma desenha a caixa (700:900)
com `size-[24px]` e `radius/md` (8px) — 50% maior, com o dobro do raio. Como `Button` e
`FeaturedIcon` têm escala de tamanho e `Checkbox` não, parece omissão e não decisão.

Aplicado como o DS renderiza, sem override. O resultado é um controle visivelmente menor que o
do design dentro de um cartão de 56px de altura.

## 18. `Chip` e `Tag` existem, mas nenhum dos dois é o chip do design

**Severidade:** média

A tela 5 escolhe dias da semana com pílulas selecionáveis: fundo `surface/base`, borda
`outline/subtle`, `radius/full`, 16/8 de padding, Label M, e um estado marcado que inverte para
`action/primary` com texto `fg/on-action`.

| | Chip do DS | Tag do DS | Figma |
|---|---|---|---|
| raio | `rounded-md` (6px) | `rounded-md` (6px) | `radius/full` |
| fundo | superfície de categoria | `surface-subtle` | `surface/base` |
| borda | nenhuma | `outline-default` | `outline/subtle` |
| estado marcado | não tem | `checked` com addon | inverte o preenchimento |

O `Chip` do DS é uma etiqueta de categoria dispensável; o `Tag` é uma etiqueta com addons. Nenhum
é um filtro selecionável. **Colisão de nome:** o componente do Figma também se chama `Chip`, o
que faz parecer que já existe.

**Contorno:** `src/components/local/choice-chip.tsx`.

## 19. `Avatar` é redondo e ponto final

**Severidade:** baixa

```tsx
'inline-flex items-center justify-center rounded-full font-semibold overflow-hidden shrink-0'
```

`rounded-full` está no base do `cva`, então nenhuma variante muda a forma. O
`card-profissional` da tela 7 usa um avatar **quadrado de 88px com cantos de 24px** — nem a
forma nem o tamanho existem na escala do componente. Usei um `img` direto.

O token `outline/avatar` também diverge: o DS resolve `rgb(0 0 0 / 8%)` e o Figma
`rgba(110,110,110,0.4)` — bem mais visível.

## 20. `Textarea` diverge em fundo, tamanho de fonte e altura mínima

**Severidade:** baixa

| | DS | Figma (28026:4879) |
|---|---|---|
| fundo | `bg-surface-base` (branco) | `surface/faint` (#fafaf9) |
| texto | `text-body-m` (16px) | 14px |
| altura mínima | `min-h-[80px]` | 120px |

O raio bate (`rounded-2xl` = 16px = `radius/xl`), e o `placeholder-shown:border-outline-subtle`
reproduz certo a borda clara do estado vazio. Só a altura foi acertada, via `rows` — prop nativa,
não override de estilo.

## 9b. O buraco de 24px na escala de raio agora aparece

Complementa o item 9. O `radius/xxl` (24px) que eu havia registrado como "usado no card do
Diário de humor" é usado também pelo `card-profissional` e pelo avatar dele — os dois elementos
de maior peso visual da tela 7. `rounded-2xl` (16px) é o teto do DS, então a tela inteira sai com
cantos mais fechados que o desenho.

## 21. Divergências menores acumuladas

**Severidade:** baixa

- **Borda do `Button variant="outlined"`**: 1px no DS, 0,5px no Figma. Aparece nos botões
  "Não sei ainda", "Pular essa parte" e "Não tenho preferência".
- **Efeito NOISE do orbe**: o `Guia_Assistente` tem um efeito de ruído do Figma
  (`MONOTONE`, `noiseSize` 0.493, branco a 0.208, densidade 0.9) que a exportação SVG por
  camada não carrega — as camadas chegam lisas. Não é lacuna do DS; reconstruí com
  `feTurbulence` em `guia-orb.tsx`, com a derivação dos números comentada lá.

---

## Anexo B — divergências no arquivo do Figma, seção Match

### B1. Mobile e desktop listam opções diferentes na mesma tela

Na tela 2 as duas listas não têm relação:

| Mobile (1105:10872) | Desktop (1133:1393) |
|---|---|
| Autoconhecimento | Não sei ainda |
| Equilíbrio | Autoconhecimento |
| Família | Ansiedade / preocupação constante |
| Saúde mental | Tristeza / desânimo |
| Ansiedade | Estresse e esgotamento |
| Estresse | Relacionamento(s) |
| Vícios | Luto ou perda |
| | Outros |

Um app só não pode servir as duas: a seleção quebraria ao cruzar o breakpoint. **Resolvido:**
mobile é canônico neste fluxo, conforme combinado. A lista do desktop parece a passada mais
recente e vale reconciliar no arquivo.

### B2. Barra de progresso e badge não carregam informação nenhuma

| Passo | Badge | Barra mobile | Barra desktop |
|---|---|---|---|
| 2 O que te traz aqui | 6% | 5,7% | 29,3% |
| 3 Informações adicionais | 12% | 5,7% | 29,3% |
| 4 Preferência de abordagem | **6%** ✗ | 5,7% | 29,3% |
| 5 Suas sessões | **98%** ✗ | 5,7% | 29,3% |
| 7 Sessões recomendadas | 76% | 80,6% | 92,3% |

Todas as barras mobile são 15,891px de 279, e todas as desktop 112,5px de 384 — este último é o
mesmo valor obsoleto que o Cadastro já tinha. O badge do passo 4 é cópia literal do passo 2, e o
98% do passo 5 vem antes do 76% do passo 7.

**Resolvido:** mantidos 6, 12 e 76 (os únicos plausíveis) e interpolados 33 e 55 para os passos 4
e 5. Badge e barra saem do mesmo campo `progress`.

### B3. Rótulos de etapa obsoletos no texto renderizado

Nos passos 5 e 7 o rótulo **renderizado** é "Temas para a sessão" — o do passo 2 — em telas sobre
horários e sobre resultados. No Cadastro só os nomes de camada mentiam; aqui é o texto em si.
Reproduzido como está, porque cópia é decisão de design.

### B4. Erros de digitação

- Tela 4, subtítulo: "Sua **preferencia** por especialidade" (sem acento).
- Tela 7, título: "Sessões **recomendas**" — enquanto o subtítulo logo abaixo escreve
  "recomendadas".

Os dois reproduzidos como desenhados.

### B5. A tela 2 não tem ação primária em frame nenhum

Nem o mobile nem o desktop desenham um botão de avançar — e o desktop está com dois temas
marcados, o que deixa a tela sem saída depois de escolher. As telas 3, 4 e 5 ganham o primário nos
frames "- filled" ("Escolher abordagem", "Escolher horário das sessões", "Buscar sessões"). Só a
tela 2 fica sem.

**Resolvido:** um "Continuar" foi acrescentado para o fluxo continuar percorrível. É a única cópia
do protótipo que não vem do arquivo.

### B6. Dois frames numerados "6."

"Buscando profissionais" (805:2472 / 861:3898) e "Buscando sessões" (861:4096 / 861:4072) são a
mesma tela com cópias diferentes, ambas numeradas 6. São alternativas, não passos consecutivos —
o protótipo implementa a de "sessões", que é a que desemboca na lista do passo 7, e registra os
nodes da outra em `steps.ts`.

### B7. O subtítulo da tela 1 muda entre breakpoints

Mobile credita "a IA do Guia irá indicar"; desktop diz só "vamos indicar". Mobile é o canônico.

### B8. A tela 7 é onde a regra "mobile é canônico" mais custa

O frame desktop (1134:2891) corrige três coisas que o mobile erra:

| | Mobile (1119:12688) | Desktop (1134:2891) |
|---|---|---|
| título | "Sessões **recomendas**" | "Sessões **recomendadas**" |
| rótulo da etapa | "Temas para a sessão" (obsoleto) | "Com base no seu perfil" |
| retratos | 1 imagem repetida em 3 dos 4 cards | 4 retratos distintos |

O **layout** do desktop foi implementado como desenhado — coluna de 1000px e grade de duas
colunas, que é o que justifica o trilho de 934px daquele frame. Já a **cópia** seguiu a regra e
ficou com a versão mobile, o que preserva o typo e o rótulo obsoleto nos dois breakpoints.

É uma linha em `sessoes-recomendadas-screen.tsx` para inverter, caso prefira a cópia do desktop
aqui.

---

# Achados do fluxo Agendamento

Terceira fatia (seção `1184:5843`). Este fluxo exercitou partes do DS que os dois anteriores
não tocaram: abas, seletor de data e avatar com iniciais.

## 22. `Tabs` diverge em contêiner, cor ativa e rolagem

**Severidade:** média

A tela de detalhes da sessão tem quatro abas — Descrição, Avaliações, Mais sessões,
Certificações — desenhadas como pílulas soltas sobre branco, numa linha que rola de lado.

| | DS | Figma |
|---|---|---|
| contêiner da lista | `TabsList` desenha borda + `surface-subtle` + `rounded-2xl` | nenhum — pílulas soltas |
| fundo da aba ativa | `action-primary` (#1c2e17) | `category/green/icon` / `tab/background-item/active` (#466700) |
| texto da aba ativa | `fg/on-action` (#ecfaca) | `navigation/text/active` (#f0fcdd) |
| raio | `rounded-xl` (12px) ✓ | 12px ✓ |
| transbordo | sem tratamento | `overflow-x: auto` |

O raio bate. O resto não, e o contêiner com borda é a diferença mais visível: o DS
desenha uma caixa que o design não tem. Aplicado como o DS renderiza.

Os tokens `tab/fg/default` e `tab/background-item/active` do Figma **não existem** no DS —
não há grupo `tab/*` em `colors.css`.

## 23. Existe um seletor de data, mas não é este — e ele obriga o consumidor a instalar date-fns

**Severidade:** média

`InlineDatePicker` é exportado e usa `react-day-picker` por baixo, com a cor de seleção
certa (`action-primary` / `fg-on-action`). Só que diverge em tudo que esta tela desenha:

| | DS | Figma |
|---|---|---|
| moldura | `border-outline-default` + `rounded-xl` + `p-3` | sem moldura, sangra na coluna |
| título do mês | `text-label-s` em `fg-brand`, centrado, com setas ‹ › | "Agosto 2026" em serifada 24px, à esquerda, sem setas |
| célula do dia | 40px, `rounded-full` | 44px, raio 16px |
| início da semana | `weekStartsOn` 1 (segunda) | domingo (prop resolve) |

**E o `locale`:** `CalendarProps.locale` é tipado como `Locale` do **date-fns**. Como
date-fns é dependência do DS e não do app, passar `ptBR` exigiria instalar date-fns no
consumidor só para alimentar o design system. Sem isso, o calendário renderiza "August
2026" e os dias da semana em inglês.

**Contorno, por decisão sua:** `src/components/local/month-calendar.tsx`, fiel ao desenho e
sem dependência nova — datas vêm de `Intl`/`Date` da plataforma.

**Correção sugerida:** aceitar uma string de locale (ou o próprio `Intl`) em vez do objeto
do date-fns, e expor props para moldura e forma do dia. `DatePickerPanel` continua sem
export (item 1).

## 24. `Avatar` serve aqui — com duas diferenças pequenas

**Severidade:** baixa (registrado como contrapeso)

O monograma de 40px dos depoimentos é o primeiro caso em que o `Avatar` do DS encaixa:
`size="md"` dá 40px com `text-label-s` e `fg/muted`, exatamente como o Figma. Duas
diferenças, deixadas como o DS renderiza: ele preenche com `surface/muted` onde o Figma usa
`surface/subtle`, e não desenha a borda `outline/avatar`.

Isso contrasta com o item 19: o avatar **quadrado** de 88px continua impossível.

## 25. A nota das avaliações é tipografada em DM Sans, fonte que o pacote não traz

**Severidade:** baixa

As estrelas do `card-review` saem em `DM_Sans:Regular` a 18.379px no Figma. O DS traz
Calma Serif e Inter Tight; DM Sans não está em `src/assets/fonts/` nem em `fonts.css`. É
provavelmente resquício de biblioteca antiga — o `README.md` do DS ainda cita
"Poppins/DM Sans" (item 7). Renderizado na fonte de corpo.

## 26. O mesmo token de raio está ligado a dois valores diferentes no arquivo

**Severidade:** média (reforça o item 9)

Lendo o `cornerRadius` real dos nós:

| Nó | Variável exportada | Valor real |
|---|---|---|
| `radio-group-item` (Match, tela 2) | `radius/xl` | **16px** |
| `segmented-tab` (Agendamento, detalhes) | `radius/xl` | **12px** |
| `card-profissional` (Match, tela 7) | `radius/xxl` | 24px |

Ou seja: `radius/xl` aparece com fallback 16px numa tela e 12px em outra. Não é só que os
nomes do DS e do Figma estão deslocados (item 9) — dentro do próprio arquivo o nome não
identifica o valor. **Só a geometria do nó é confiável.** Vale reforçar a regra do
CLAUDE.md: nunca traduzir raio pelo nome do token, nem pelo fallback da exportação.

---

## Anexo C — divergências no arquivo do Figma, seção Agendamento

### C1. O desktop de "Detalhes da sessão" é outro design, com dados que o mobile não tem

Não é reflow. O mobile empilha título (Label L 20px), profissional e uma barra de abas
rolável. O desktop (1236:12522) elimina as abas e divide em duas colunas: à esquerda o
título em **serifada display**, o profissional e o CTA; à direita todas as seções
empilhadas.

O desktop ainda mostra dados que não existem no mobile: **"Avaliações (38)"** com média
**4,5**, e um botão "Ver todas as avaliações". Como são exclusivos daquele frame, foram
implementados só lá.

### C2. Nomes dos frames desktop novamente errados

Três frames diferentes se chamam "escolher horário - horário selecionado" (1279:13985,
1279:14636, 1279:14976) — pela posição no canvas eles são, na ordem, o horário selecionado,
a lista de horários e as informações complementares vazias. E o desktop de "Sessão
agendada" (1279:15911) se chama **"[Desktop] 3. Empresa encontrada"**, resquício do arquivo
de Cadastro. Terceira ocorrência do mesmo problema (ver A3 e o item 5 do anexo B).

### C3. Erros de digitação

- "Hoje - Terça-feira, 4 de Agosto **ás** 19:00" — falta a crase, nas telas 2 e 4.
- "**Data de horário**" como rótulo do bloco de data na tela de confirmação, onde o
  esperado seria "Data e horário".

Reproduzidos como desenhados.

### C4. A aba "Certificações" é desenhada em todos os frames e não tem conteúdo em nenhum

Ela aparece nas três variantes de "Detalhes da sessão", mas não existe frame que mostre o
que ela abre. No protótipo a aba existe e informa que não há conteúdo desenhado — melhor do
que uma aba que abre no vazio, e mais honesto do que inventar certificações.

### C5. O helper do WhatsApp só aparece no frame preenchido

"Usado para o profissional entrar em contato" existe em 1236:10602 e não em 1204:997, no
mesmo campo. Parece esquecimento no frame vazio; reproduzido como está.

### C6. Aqui a barra de progresso funciona

Registrado como contrapeso ao anexo B: nesta seção badge e barra concordam
(140/279 = 50,2% para 50%; 209/279 = 74,9% para 75%), as camadas têm nomes corretos
("Etapa 3 de 4: Data e horário") e as transições 50→60% e 75→85% são intencionais e estão
desenhadas nos pares de frames. Nada precisou ser recalculado.

---

# Achados do review de entrega (09/09/2026)

Vieram de revisar o protótipo pronto, não de construí-lo. Os três primeiros são a razão de
três pedidos da revisão não terem solução dentro do design system hoje.

## 27. Falta antialiasing — é por isso que a Calma Serif sai mais grossa que no Figma

**Severidade:** alta (afeta todo texto, em todo consumidor)

Nem o design system nem o app declaravam `-webkit-font-smoothing`. O Chrome no macOS usa
antialiasing **subpixel** por padrão, que engrossa cada traço; o Figma rasteriza sempre em
**grayscale**. A diferença aparece em toda fonte, mas é gritante numa serifada de traço
fino: a Calma Serif ganha cerca de meio pixel por haste e lê como um peso acima.

Não tem relação com o SemiBold ausente (item 15) nem com `font-synthesis`. É só a
rasterização.

**Verificado assim:** `grep -rn "font-smoothing" src/` no design system não retorna nada, e
`tokens/fonts.css` também não declara. Adicionar

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

alinha o render com o arquivo.

**Contorno adotado:** declarado em `src/styles/index.css` do protótipo. **Lugar certo é o
design system** — todo consumidor vai ter o mesmo problema, e ninguém vai adivinhar a
causa.

## 28. `Button` não consegue mostrar carregamento sem desabilitar

**Severidade:** média

```tsx
disabled={isLoading || disabled}
```

`isLoading` sempre desabilita. A revisão pediu o contrário para a busca de empresa — o
botão deve continuar ativo enquanto identifica —, e a referência do Figma desenha assim.
Como o comportamento está fixo no componente, não há prop que resolva.

**Contorno no protótipo:** não usar `isLoading`; passar o spinner como `leadingIcon` e
controlar o rótulo. Funciona, mas duplica o que o componente já sabe fazer, e perde o
`Spinner` interno (que não é exportado).

**Correção sugerida:** separar as duas ideias — `isLoading` mostra o spinner, `disabled`
desabilita — ou um prop `disableWhileLoading` com o padrão atual.

## 29. `ProgressBar` não tem variante de cor

**Severidade:** baixa

O preenchimento é sempre `bg-action-primary`. Uma barra de força de senha quer ir de
vermelho a verde conforme melhora, e os tokens existem (`category/red`, `category/sunflower`,
`category/green`), mas o componente não os expõe.

**Contorno:** a barra é usada como o DS a renderiza e o sinal de cor foi para o rótulo ao
lado, que é elemento nosso — sem override de `className`.

## 30. O anel de foco do `Input` é `box-shadow`, e some dentro de contêiner com rolagem

**Severidade:** baixa (armadilha para o consumidor)

O foco é `shadow-[0_0_0_2px_…,0_0_0_4px_…]`. Sombra não conta como conteúdo para o layout,
então qualquer ancestral com `overflow` diferente de `visible` a recorta — e `overflow-y:
auto` também recorta na horizontal, por regra do CSS. No protótipo o campo de texto do
Match aparecia com o anel cortado nos dois lados no desktop.

**Contorno, em duas partes** — a primeira tentativa não resolveu porque havia *dois*
contêineres recortando, aninhados:

1. O contêiner de rolagem do conteúdo (`overflow-y-auto`) recorta na própria caixa de
   padding. Resolvido com `lg:-mx-1.5` + `lg:px-1.5`: abre 6px de folga interna sem mexer
   no alinhamento da coluna.
2. O wrapper da transição tinha `overflow-x-hidden` para absorver o deslize de ±24px, e
   recortava exatamente na borda da coluna — cortando por fora a folga aberta em (1). O
   recorte subiu para `html`, no `styles/index.css`, que é a única camada longe o bastante
   dos campos.

A lição para o design system: **qualquer** ancestral com `overflow` entre o campo e a
viewport apaga o anel, e `overflow-y: auto` recorta na horizontal também, por regra do CSS.
Um consumidor com layout de rolagem interna vai tropeçar nisso sem aviso.

**Nota:** um `outline` com `outline-offset` não teria esse problema, já que outline não é
recortado por overflow. Vale considerar na próxima revisão do componente.

## 31. `NavBar` existe, não é exportado, e é a navegação de outro produto

**Severidade:** alta — é o componente de que a seção inteira precisava

Esta fatia do protótipo (Início, Busca, Meus agendamentos) é a primeira que precisa de
navegação permanente. O DS tem um `NavBar`, e ele não serve por três razões independentes:

1. **Não está no barrel.** `grep NavBar dist/index.js` → zero ocorrências no tarball
   publicado. O componente existe no `src` do design system, mas não é empacotado, então
   nenhum consumidor consegue importá-lo.
2. **`NavBarProps` não tem prop de itens.** Os destinos são fixos dentro do componente.
3. **Os destinos fixos são os do app do _profissional_** — `atendimentos`, `prontuarios`,
   `servicos`. O colaborador precisa de Início / Buscar / Agendamentos / Diário / Meu
   progresso.

**Contorno:** `src/components/layout/nav-shell.tsx`, que desenha as duas formas do Figma —
a pílula inferior do mobile (`bottom-nav-bar`, 28150:1265) e a régua de 280px do desktop
(`desktop-navigation`, 1526:900) — a partir de `src/shell/destinos.ts`.

**Correção sugerida:** exportar o componente e receber os itens como dado
(`items: { href, label, icon }[]`), com o item ativo derivado por callback ou por prop. Um
componente de navegação que embute os destinos de um produto não pode ser compartilhado
entre dois.

## 32. Os tokens `nav-*` de item ativo estão invertidos em relação ao design

**Severidade:** alta (dentro do item 31)

O Figma pinta o item ativo da barra inferior com `navigation/background-item/active`
**#5A8200** e texto/ícone em `navigation/icon/active` **#F0FCDD** — chip escuro-oliva com
texto claro. O DS declara o contrário:

| token do DS | valor | o que o Figma quer |
|---|---|---|
| `--color-nav-bg-active` | `brand-lime-light-25` (#ECFACA) | #5A8200 |
| `--color-nav-icon-active` | `brand-dark-800` (#1C2E17) | #F0FCDD |
| `--color-nav-text-active` | `brand-lime-950` (#0B1500) | #F0FCDD |

Os dois valores que o design pede existem no DS — `brand-lime-600` é #5A8200 e
`brand-lime-medium-25` é #F0FCDD — mas só como primitivos, sem nome semântico.

**Contorno:** `bg-[var(--color-brand-lime-600)]` e
`text-[color:var(--color-brand-lime-medium-25)]` no item ativo, com o motivo no código.
Usar o par semântico renderizaria uma barra visivelmente diferente do desenho. Ver também
o item 33, que é por que não dá para escrever `bg-brand-lime-600`.

**Correção sugerida:** trocar os valores de `nav-bg-active` / `nav-icon-active` /
`nav-text-active` pelos do design. Os nomes já estão certos; só o que eles apontam é que
está trocado.

## 33. Os primitivos vivem em `:root`, não em `@theme` — não geram utilitário nenhum

**Severidade:** média (armadilha silenciosa)

`tokens/primitives.css` declara os ~275 primitivos dentro de `:root`. Só `colors.css`,
`typography.css`, `spacing.css` e `shadows.css` usam `@theme`. Como o Tailwind v4 só gera
utilitário a partir do namespace registrado em `@theme`, **`bg-brand-lime-600` e
`text-brand-lime-medium-25` não existem** — a classe é escrita, o build passa, e nada é
aplicado. O CSS gerado tem a variável, mas nenhuma regra que a use.

Isso é coerente com o comentário do próprio arquivo ("Never imported directly by
components — use semantic tokens"), e é a decisão certa. O problema é que o consumidor
descobre a regra por um elemento que renderiza sem cor, sem erro nem aviso.

**Contorno:** `bg-[var(--color-brand-lime-600)]`, que consome o token pelo nome e não
embute hex nenhum. Note que na versão de cor o `color:` é obrigatório —
`text-[var(--x)]` sem a dica é lido pelo Tailwind como tamanho de fonte, e falha do mesmo
jeito silencioso.

**Correção sugerida:** documentar em uma linha que os primitivos são deliberadamente
inacessíveis como utilitário, e o que fazer quando um valor só existe lá (pedir o token
semântico).

## 34. Não existe `Dialog` em folha inteira — o painel de filtro da Busca não cabe nele

**Severidade:** média

`modal-drawer / Temas` (1794:2449) é uma folha que cobre a tela com 4px de recuo, raio 16,
título à esquerda, `icon-button` de fechar à direita e a ação presa embaixo. O `Dialog` do
DS não chega perto: `DialogContent` é fixo em `left-1/2 top-1/2 -translate-*`, `max-w-lg`,
`rounded-lg`, e **embute um ✕ próprio** no canto que não é desligável por prop. Chegar no
desenho exigiria reescrever posição, largura, raio e padding por `className` e ainda
conviver com dois botões de fechar.

**Contorno:** `src/components/local/painel-filtro.tsx`, com overlay próprio e `Escape`.

**Reincidiu** em `src/components/local/detalhes-sessao.tsx`: o mesmo `modal-drawer` do Figma,
agora ancorado à direita com 512px e um scrim de 30% (`1794:349`). São dois componentes locais
desenhando o mesmo componente do arquivo porque o DS não tem como — é o sinal mais forte até
aqui de que a lacuna vale correção.

**Correção sugerida:** uma variante `sheet` / `fullscreen` / `drawer` do `DialogContent`, com
ancoragem por prop, e tornar o botão de fechar embutido opcional.

## 35. Divergências menores acumuladas — Início, Busca e Meus agendamentos

**Severidade:** baixa, em bloco

| onde | Figma | DS | decisão |
|---|---|---|---|
| badge "Nível 1" | `#e5d7f7` / `#63359a` (hex cru, sem variável) | não existe: não há família `category/lavender`, e `brand-lavender-200` é #E5BAEE, um roxo mais rosado | `Badge variant="info"` (índigo) |
| badge "123 pts" | `category/green/surface-strong` (#BAE384) | `Badge variant="success"` pinta `category/green/surface` (#ECFACA); não há opção "strong" | `success` |
| badge "3 restantes" | pílula de contorno, fundo transparente + `outline/subtle` | `Badge` não tem variante de contorno | `neutral` |
| botão de menu do Início | 58px | `IconButton` é fixo em 42px, sem prop de tamanho | 42px, como o DS renderiza |
| campo de busca | ícone de lupa à esquerda, placeholder Body S | `Input` não tem slot de ícone; placeholder é `text-body-m` | ícone posicionado por cima, `pl-9` |
| sombra do banner do Match | `0 2px 2px rgba(0,0,0,0.04)` | nenhum token bate | `shadow-xs` |
| cartões (atalho, sessão, profissional) | `radius/xxl` = 24px | escala para em `rounded-2xl` = 16px | `rounded-2xl` — reincidência dos itens 9 e 9b |

Nada aqui foi mascarado com `className`: onde o DS renderiza diferente, ele renderiza
diferente e está anotado no código.
