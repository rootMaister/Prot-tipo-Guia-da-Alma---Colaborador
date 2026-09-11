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
