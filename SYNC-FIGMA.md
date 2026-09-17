# Sincronizar no Figma — review de 09/09/2026

O que a revisão mudou no protótipo e o que cada item implica no arquivo do Figma ou no
design system. Ordenado por onde a mudança precisa acontecer.

---

## Precisa ser desenhado no Figma (não existe hoje)

| Item | Onde | O que falta |
|---|---|---|
| **Barra de força da senha** | Cadastro → Senha (`1078:9101` / `1089:10222`) | Componente novo abaixo do campo. No código: barra + rótulo "Força da senha: Fraca/Razoável/Boa/Forte". |
| **Pop-up de confirmação do "Pular match"** | Match, rodapé de todas as telas do questionário | Modal com "Deseja pular o match de terapia? Você poderá realiza-lo outra hora." e as ações "Pular match" / "Voltar". |
| **Opção "Qualquer horário"** | Match → Suas sessões (`1119:12331`) | Um `radio-group-item` a mais, no topo de "Melhores horários", que marca todos os outros. |
| **Estado de hover** | `radio-group-item` (`679:805`) e `Chip` (`28162:4`) | Os component sets não têm variante Hover. No código: superfície `surface/subtle` + borda `outline/default` no não selecionado. |
| **Estado de foco do código da empresa** | `company-code-identifier` (`1017:272`) | Falta a variante Focused com o mesmo anel do `input` (borda `outline/brand` + sombra 2px/4px). |

## Precisa mudar no arquivo do Figma

| Item | Onde | Mudança |
|---|---|---|
| **Barra de status do iOS** | Todos os frames mobile dos 3 fluxos | Removida do protótipo por decisão da revisão. Se a intenção é que ela não exista, vale tirar dos frames também — hoje todo frame mobile a desenha. |
| **Máscara de WhatsApp** | Cadastro → Suas informações; Agendamento → Informações complementares | Os frames mostram só o placeholder. O preenchido deveria mostrar `(11) 99999-9999` formatado, como o código agora faz. |
| **Máscara de CPF** | Agendamento → Informações complementares (`1236:10602`) | Idem: o frame preenchido mostra `123.123.123-12`, que já está no formato certo — só falta declarar que é máscara e não texto livre. |
| **Botão de voltar do detalhe da sessão** | Agendamento → Detalhes desktop (`1236:12522`) | Deve ser o `icon-button` do design system, não o botão desenhado hoje. |
| **Títulos das seções do detalhe** | Agendamento → Detalhes desktop | "Sobre a sessão", "Avaliações", "Mais sessões oferecidas por Daniele" passam a Label M / `fg/default`. |
| **Disponibilidade de horários** | Agendamento → Escolher horário (`1202:715`) | Os frames repetem os mesmos quatro horários em todo dia. O protótipo agora varia por dia (domingo fechado, sábado só de manhã), o que deixa a tela mais crível. |
| **Transições entre telas** | Protótipo do Figma, todos os fluxos | Avanço: o conteúdo entra pela direita. Retorno: pela esquerda. O header, o botão de voltar, a barra de progresso e o rodapé ficam **parados** — só o conteúdo (título incluído) se move, e a barra avança no lugar. |
| **Entrada da tela de código da empresa** | Cadastro → Identificador da empresa | Os elementos sobem 16px com fade, em cascata. |
| **CTA sempre visível** | Match → Suas sessões; Cadastro → Identificador da empresa | O arquivo só desenha o botão de avançar no estado preenchido, ou cinza sem explicação. No protótipo ele fica sempre visível e o rótulo diz o que falta — "Selecione um dia ou horário", "Digite os 6 dígitos" —, no mesmo padrão que "Insira o seu CPF" já usava. Esconder o primário tira a referência do que a tela faz e o gatilho para descobrir o que impede de continuar. |
| **CTA de passo opcional** | Match → Mais detalhes | O primário aparecia só depois de o campo ter texto. Como o passo é opcional, não há mínimo a exigir: ele fica sempre ativo. |
| **Sem foco automático no código da empresa** | Cadastro → Identificador da empresa | O campo focava sozinho ao abrir, o que subia o teclado na hora e rolava o título para fora — a tela abria sem dizer do que se tratava. Agora abre parada e o teclado só sobe ao toque. |
| **Rodapé com teclado aberto** | Todos os formulários, mobile | Enquanto o teclado está aberto o rodapé deixa de ser ancorado e rola junto com o conteúdo, para os campos ficarem com o que sobra de tela; o header vira sticky e continua parado. Sem teclado nada muda. Não é algo que o arquivo desenhe — vale decidir se entra como estado no Figma. |

## Não precisa mudar no Figma — era erro do código

| Item | Nota |
|---|---|
| **Ícone dos feedbacks centralizado** | O Figma já desenha o ícone a ~45% da altura do frame (`275:2195`). A implementação é que o colocava a ~35%. Corrigido para bater com o desenho. |
| **Anel de foco cortado no campo de texto** | O contêiner de rolagem do shell recortava a sombra do foco. Nada a ver com o design. |
| **Calma Serif mais grossa** | Ver abaixo — é renderização, não desenho. |

## Precisa mudar no design system

| Item | Componente | Nota |
|---|---|---|
| **Antialiasing** | tokens / reset | Causa da Calma Serif "mais grossa". Ver item 27 do [DS-GAPS.md](DS-GAPS.md). |
| **Loading sem disabled** | `Button` | `disabled={isLoading \|\| disabled}` não deixa mostrar carregamento com o botão ativo. Item 28. |
| **Cor na barra de progresso** | `ProgressBar` | Sem variante de cor, então a barra de força não pode ir de vermelho a verde. Item 29. |
| **Hover e foco** | `Checkbox`, `Chip` | Sem estados de hover; o `Chip` do DS nem é o chip do design (item 18). |

---

# Sincronizar no Figma — Início, Busca e Meus agendamentos (11/09/2026)

Levantado ao implementar os três destinos do app. Mesma divisão da revisão acima.

## Precisa ser desenhado no Figma (não existe hoje)

- **Lista de Especialidades.** O filtro tem botão ("Especialidades") e chip aplicado
  ("Psicanálise"), mas o painel só existe para Temas. A lista usada no protótipo —
  Psicanálise, Junguiana, Cognitivo-comportamental, Terapia familiar, Terapia de casal,
  Humanista — foi tirada das abordagens que os próprios títulos de sessão citam, e não tem
  desenho por trás.
- **O que o botão de menu do Início abre no mobile.** O botão de 58px está desenhado em
  1429:6287 e não leva a lugar nenhum: Diário e Meu progresso só aparecem na régua do
  desktop. No protótipo ele abre um diálogo com os mesmos cinco destinos.
- **Estado vazio de Meus agendamentos.** Os dois frames desenham duas sessões; ninguém
  desenhou a tela de quem ainda não agendou.
- **Estado vazio da Busca.** Nenhum frame mostra "nenhum resultado".
- **Telas de Diário e Meu progresso.** Estão na régua do desktop e não existem em lugar
  nenhum. No protótipo aparecem no menu, com a aparência do desenho, e não navegam.

## Precisa mudar no arquivo do Figma

- **Há quatro grades de desktop no arquivo, e só uma centraliza o conteúdo na tela.**

  | tela | régua | conteúdo | centro da coluna | centro do frame |
  |---|---|---|---|---|
  | Início (590:9086) | 406, montada à mão (menu ocupa 222) | 406→1034 (628) | **720** | 720 |
  | Busca (1526:908) | 280, instância | 280→1280 (1000) | 780 | 720 |
  | Meus agendamentos (1558:1876) | 280, instância | 280→1280 (1000) | 780 | 720 |
  | Agendamento — Com navegação (1617:4660) | 280, instância | 360→1360 (1000) | 860 | 720 |

  Só o Início centraliza de verdade: os 628px de conteúdo caem no centro exato do frame, e
  a coluna de navegação de 406 é só a margem esquerda que por acaso segura o menu — que
  ocupa 222 dela. As outras três empurram a coluna para a direita em graus diferentes.

  **É a grade do Início que o protótipo segue**, porque é a única em que o conteúdo fica
  centrado na tela: a régua sai do fluxo e a coluna centraliza na viewport inteira.
  A largura passa a ser a variável livre — teto nos 1000 desenhados na Busca e em Meus
  agendamentos, piso em ficar 24px livre da régua. 1000 simplesmente não cabe centralizado
  num frame de 1440 com régua de 280 (começaria em 220, por baixo do menu), então a 1440
  a coluna sai com 832 e a partir de 1608 com os 1000 cheios. Centrada em qualquer largura.

  **Sugerido no arquivo:** centralizar a coluna nas outras três telas, e trocar a coluna de
  navegação do Início pela instância `desktop-navigation`.

- **O mesmo `card-profissional` mostra a data em dois formatos.** "Hoje, 24 de Ago ás
  19:00" no Início e "8 de setembro • 19:00" em Meus agendamentos, para a mesma sessão.
  O protótipo usa o segundo nos dois lugares. **Sugerido:** escolher um.
- **"Vícios" aparece duas vezes na lista de Temas** (1324:16928) — uma no meio e outra no
  fim. A duplicata foi descartada.
- **"3 restantes" fica igual nos dois estados do Início.** No frame sem sessão agendada
  ainda diz 3, quando deveria dizer 4. No protótipo o número vem do estado.
- **Os rótulos da régua do desktop não estão ligados ao token de tipografia.** São Inter
  16/22 solto, enquanto o resto do arquivo usa `font-family-body` (Inter Tight). É o único
  lugar do arquivo com essa solta. O protótipo usa Label M (16/24).
- **`desktop-navigation` é desenhado com 385px e usado com 280px** em todas as telas. O
  componente deveria nascer na largura em que é usado.
- **O badge "Nível 1" é hex cru.** `#e5d7f7` e `#63359a` não estão ligados a variável
  nenhuma — nem no arquivo, nem no DS. Ver item 35 do DS-GAPS.md.
- **"Aplicar filtro" é desenhado desabilitado quando nada está marcado.** No protótipo ele
  fica sempre ativo, porque aplicar uma seleção vazia é como se limpa o grupo — mesmo
  raciocínio da decisão de revisão de manter o CTA visível e deixar o rótulo carregar a
  mensagem.

## Não precisa mudar no Figma — era decisão do protótipo

- **O Início tem dois estados, não duas telas.** 1429:6283 (com sessão) e 1448:7654 (sem)
  são o mesmo destino; qual aparece depende de o fluxo de Agendamento ter sido concluído.
- **Os resultados da Busca são filtrados de verdade.** As etiquetas de tema e
  especialidade de cada profissional não estão no arquivo — foram atribuídas para que o
  resultado desenhado (Ansiedade + Estresse + Psicanálise → Lucas, Mariana, Carlos) saia
  exatamente igual.
- **O botão de abrir o Diário no cartão de atalho não navega**, mas continua com a
  aparência do desenho em vez do cinza de desabilitado — a mesma escolha feita para Diário
  e Meu progresso na régua.

---

# Sincronizar no Figma — `Detalhes da sessão` e as costuras (11/09/2026)

Levantado ao consertar os botões do app que devolviam a pessoa para telas do onboarding.

## Entra no protótipo

- **A página "Sessão"** (`1769:9484`) — `[Mobile] 1a. Detalhes da sessão — pré-sessão`
  (`1776:3`) e `[Desktop] 1a. Drawer — pré-sessão` (`1784:30`). É o destino de "Acessar
  detalhes" no Início e de "Ver detalhes" em Meus agendamentos, que até agora abriam o passo 1
  do fluxo de Agendamento — a tela de *pré*-agendamento, com "Agendar com Daniele" no rodapé,
  para uma sessão que já estava marcada.

## Precisa ser desenhado no Figma (não existe hoje)

- **Onde "Ver perfil do psicólogo" leva.** Não há página de perfil em lugar nenhum do arquivo.
  No protótipo o botão é desenhado como está e não navega.
- **Onde "Entrar na sala" leva.** A sessão é online via Google Meet e não há sala. Mesmo
  tratamento.
- **O estado pós-sessão.** A página "Sessão" tem `1b. Sessão iniciada — profissional não
  compareceu`, que não foi construído, e a página "Avaliação" (`1769:9713`) inteira também não.

## Precisa mudar no arquivo do Figma

- **A mesma sessão tem dois títulos.** Os cards escrevem "Sessão de Psicoterapia
  Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+" e `Detalhes da
  sessão` (`1776:38`) escreve "Sessão de Psicoterapia Junguiana". O protótipo reproduz os dois,
  cada um onde é desenhado. **Sugerido:** escolher um, ou assumir os dois como campos
  diferentes (título completo e título curto), que é como o código os trata.
- **O botão "Quero explorar a plataforma"** (`/match/inicio`) não tem destino no protótipo do
  Figma. É a porta de "pular o match e ir para o app", e é para lá que ele vai agora.
- **"Voltar para as sessões"** é a cópia desenhada no passo de detalhe do Agendamento, e está
  certa vindo dos resultados do Match. Vindo da Busca ela nomeia a lista errada, então o botão
  passa a dizer "Voltar para a busca" / "Voltar para o início" / "Voltar para os agendamentos"
  conforme a origem. **Cópia nova, precisa ser desenhada.**

## Não precisa mudar no Figma — era erro do código

- **Tudo que levava de volta ao onboarding.** O fluxo de Agendamento sempre voltava para os
  resultados do Match, porque foi construído quando esse era o único jeito de chegar nele.
  Agora ele carrega a origem na query string e devolve a pessoa para onde ela estava.

---

# Sincronizar no Figma — as duas colunas do Agendamento no desktop (11/09/2026)

Eu tinha lido errado: registrei que só a seção "Com navegação" (`1617:*`) era de duas colunas.
**Os frames de onboarding também são** — `1279:14636`, `1279:13985`, `1279:14976`,
`1279:15398` e `1236:12522` todos trazem `profissionals` de 1000px com duas colunas de 436
separadas por 80, dentro de um padding de 24. As telas estavam construídas em coluna única de
450px. Corrigido.

## Como a grade é

| | |
|---|---|
| contêiner | 1000px, centrado na viewport (o frame tem 1536 e o conteúdo começa em 268) |
| colunas | 436 + 80 + 436, com 24 de padding de cada lado |
| coluna esquerda | botão de voltar, título da sessão (Calma Serif 32/40), `profissional-resumo`, e o resumo do que já foi preenchido |
| coluna direita | barra de progresso + rótulo + badge, o conteúdo do passo, e a ação embaixo |

O botão de voltar fica no **topo da coluna esquerda**, não ao lado da barra de progresso como
no mobile.

## O achado que muda o comportamento

**O resumo da esquerda acende por opacidade conforme os dados existem** — os blocos estão
desenhados em todos os frames e só ficam visíveis quando têm o que mostrar:

| frame | "Data e horário" | "Seus dados" |
|---|---|---|
| escolher horário, nada escolhido | 0 | 0 |
| escolher horário, hora escolhida | 1 | 0 |
| informações, vazio | 1 | 0 |
| informações, preenchido | 1 | 1 |

Ou seja, é estado, não layout. O protótipo renderiza cada bloco quando o provider tem o dado,
o que dá o mesmo resultado sem depender de opacidade.

## Precisa mudar no arquivo do Figma

- **O título da sessão em `1236:12522` estava sendo lido como Display S (44/52) no protótipo;
  o arquivo desenha 32/40** nos três passos. Corrigido no código — vale conferir se a intenção
  era mesmo o mesmo tamanho em todos.
- **"Confirmar informações" (`1279:15578`) continua em coluna única de 450px**, sozinho entre
  os passos do fluxo. Ou ele deveria ter o resumo à esquerda como os outros dois, ou os outros
  não deveriam — hoje o fluxo troca de grade no último passo.
- **Os frames de onboarding têm 1536 de largura e os "com menu" 1440.** A grade interna é a
  mesma; só a moldura muda.

---

# Sincronizar no Figma — revisão de 11/09/2026 (nove itens)

## Já estava no Figma e o protótipo não tinha

- **Welcome redesenhado.** Os nodes antigos (779:415 / 826:3114) **não existem mais**; as
  telas atuais são `2028:647` ("[Mobile] Welcome — A / Imersiva") e `2020:647`. Reconstruídas.
  Com elas caiu o painel escuro invertido do desktop, que era a única exceção aberta à regra
  de não mascarar cor do DS com `className` (item 12 do DS-GAPS.md).
- **A atmosfera do Welcome é marcada como animada** (as duas elipses têm `rotate` no export),
  mas o arquivo **não define timeline nenhuma** — `get_motion_context` volta vazio. Estão
  paradas no protótipo. Precisa da animação desenhada para sair do lugar.
- **O drawer de filtro da Busca é ancorado à direita**, 440px com 4px de recuo (`1526:5503`).
  Estava centralizado no protótipo. Corrigido; o scrim de 30% veio do frame do drawer de
  sessão (`1789:154`), já que os frames de Temas no desktop não desenham um.

## Precisa ser desenhado no Figma (não existe hoje)

- **Usuário no menu lateral.** O `desktop-navigation` (1526:900) tem só o lockup e os cinco
  itens. A revisão pediu avatar com iniciais e nome "para indicar que está logado" — está no
  pé da régua, que é onde esse bloco costuma ficar, mas é escolha do código.
- **O sobrenome da pessoa.** O arquivo só escreve "Lara", na saudação da Home; a revisão pediu
  **duas** iniciais ("ex: LD"). "Duarte" é invenção do protótipo.
- **Tags de especialidade e abordagem no `card-profissional`** (1124:13061). Não existem no
  desenho. Os valores saem dos títulos de sessão que o arquivo já escreve — "Mulheres e
  LGBT+ / Junguiana" para a Daniele, e assim por diante.
- **O botão terciário de "Encontramos sua empresa"** (670:606 / 670:616). A tela não tinha
  saída se a empresa estivesse errada. Cópia nova: "Não é essa empresa?".

## Mudou de comportamento por decisão da revisão

- **"Mais detalhes" saiu do protótipo** — o passo 3 do Match, texto livre. Os nodes ficam
  registrados em `PASSO_REMOVIDO_MAIS_DETALHES` (`flows/match/steps.ts`) e a tela volta
  recriando a entrada. A barra de progresso passa de 6% direto para 33%, que são os valores
  que o arquivo desenha nos passos vizinhos.
- **Depois de agendar, a pessoa cai em Meus agendamentos**, não no Início — por qualquer
  porta que tenha entrado.
- **A transição entre destinos é vertical no desktop** e continua lateral no mobile: o eixo
  segue a forma do menu (régua vertical × barra horizontal), em vez de ser sempre lateral.
- **A régua lateral continua na tela ao agendar a partir da Busca** — é o que os frames "com
  menu" (1617:*) desenham no desktop. No mobile não há barra nenhuma nesses frames, então lá
  agendar segue em tela cheia.

---

# Sincronizar no Figma — fluxo de Avaliação (16/09/2026)

Levantado ao construir a página "Avaliação" (`1769:9713`), seção "Avaliação pós-sessão"
(`2288:12017`). Resolve o "estado pós-sessão" que a seção de 11/09 listava como não construído.

## Decidido no protótipo, sem desenho no arquivo

- **Por onde se chega.** Nenhum frame leva à "Sessão realizada". O protótipo usa "Entrar na
  sala" de `Detalhes da sessão` (`1776:3` / `1784:30`), que até agora não navegava: como não
  existe sala, a sessão é pulada e a pessoa cai direto no fim dela. É a única porta do app para
  o fluxo. **Sugerido:** desenhar de onde a avaliação é aberta de verdade — notificação, banner
  no Início, item em Meus agendamentos.
- **Qual final vem depois da nota.** O arquivo desenha dois finais, 3a "Agradecimento" e 3b
  "Acolhimento após dificuldades", e não diz quando cada um aparece. No protótipo: **3b** para
  nota de 1 a 3 (a mesma faixa do comentário obrigatório) **ou** "Tive problemas sérios" na
  pergunta da chamada; **3a** em qualquer outro caso. Precisa ser confirmado.
- **Para onde vão os pulos.** "Agora não" (tela 1) e "Prefiro não avaliar" (nota) levam à tela
  4, "Agendar próxima sessão". "Prefiro não responder" (perguntas 1 a 3) limpa a resposta e
  segue para a próxima pergunta.
- **Os horários sugeridos.** Os três botões abrem o Agendamento no passo de horário com aquele
  dia e hora já escolhidos; "Ver outros horários" abre o mesmo passo sem escolha. "Decidir
  depois" volta para a tela do app de onde o fluxo foi aberto; "Buscar outro profissional" vai
  para a Busca.
- **Fechar o modal no desktop.** O modal não desenha ✕. `Escape` fecha e volta para o app,
  como "Decidir depois". Clicar no fundo **não** fecha, para não perder respostas por engano.
- **"+ 40 Calmas"** é só texto: nada é creditado na conta.

## Precisa ser desenhado no Figma (não existe hoje)

- **Onde "Reportar um problema" leva.** Desenhado na tela da nota, sem destino. No protótipo
  aparece e não navega, como "Ver perfil do psicólogo".
- **Voltar no desktop.** Os modais das perguntas não têm botão de voltar — só o mobile tem. O
  protótipo segue o desenho; a pessoa só volta pelo navegador.

## Precisa mudar no arquivo do Figma

| Item | Onde | Mudança |
|---|---|---|
| **Numeração dos frames** | Toda a seção | "02 · Acolhimento" é a pergunta 1 e "2a. Avaliação" é a pergunta 4. Os nomes misturam duas numerações; os nodes estão em `flows/avaliacao/steps.ts`. |
| **Cabeçalho da nota preenchida** | 2d, `2288:17020` (mobile) e `2296:12081` (desktop) | É o único estado da pergunta 4 sem "Pergunta 4 de 4" e, no mobile, sem o botão de voltar. O protótipo mantém os dois, como em 2a–2c. |
| **Gênero na cópia** | Pergunta 1, `2775:18010` | "Você se sentiu **acolhido**?" no masculino, num fluxo que agradece com "Obrigada". Reproduzido como está. **Sugerido:** "Você se sentiu acolhida/o?" ou reescrever sem gênero ("Você sentiu acolhimento?"). |
| **Espaço entre voltar e progresso** | Pergunta 4, `2288:16960` | 24px, contra 12px nas perguntas 1 a 3. O protótipo usa 12 em todas. |
| **"Buscar outro profissional" em 3b** | `2288:17077` / `2296:12290` | Botão com contorno no mobile e texto no desktop. O protótipo reproduz os dois; vale confirmar se a ênfase deveria ser a mesma. |
| **"Ver outros horários"** | Finais, desktop | Botão com contorno de 44px, altura que não existe no `Button` do DS (36 ou 52). Renderizado com 52. |

## Experimento de diário — ajustes de registro (2815:20708)

- Escala: Difícil, Pesado, Estável, Um bom dia e Fluindo. Corrigida a grafia
  “Díficil” do frame `2815:20562`. Textos de apoio reproduzidos dos cinco frames.
- Um único orb de 260px, animado continuamente pela receita `blend.json` fornecida
  pelo usuário. Velocidade, ruído, posições e divisores alimentam o campo fluido; a
  luminosidade das cores da receita é remapeada aos verdes do Figma e ao humor.
  As imagens exportadas do Figma não entram no projeto: o orb é só o canvas. Sem a aura nem a textura de fundo do experimento anterior.
- Mobile sem barra iOS, conforme decisão geral do projeto; desktop em `FeedbackShell`
  de 560px, conforme a anotação `2815:20709`, sobre o Início do app.
- Etapa de influências baseada na imagem `2815:20712`: as 13 opções, com seleção
  múltipla. A imagem define as opções, mas não uma tela mobile nem ações de conclusão.
  Adotados cápsulas responsivas com checkbox, “Voltar ao humor”, “Salvar registro”
  (habilitado com pelo menos uma influência) e “Deixar para depois”.
- A primeira etapa começa em Estável e pode avançar sem arrastar. Voltar preserva o
  humor e as influências nesta montagem; a etapa está em `?etapa=influencias`.
  Deep-link frio na etapa 2 inicia o rascunho em Estável, sem influências.
- Confirmação final local com resumo do humor e influências; sem backend ou persistência
  após recarregar. “Concluir”, “Deixar para depois” e Escape voltam à origem da query,
  ou ao índice (`/`) quando aberto diretamente.
