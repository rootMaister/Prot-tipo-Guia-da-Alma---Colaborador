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
