# Coleta e replay do onboarding

Implementação local na branch `codex/posthog-onboarding`, a partir de `9d3ef48`.
SDK oficial `posthog-js`, instalado diretamente; não foi executado um instalador interativo.
Não houve deploy nem criação de dashboard. Em 22/09/2026, o token público foi configurado
somente em `.env.local` e o recebimento de eventos locais foi confirmado no projeto 621293.

## Ativação local e na Vercel

1. Copie `.env.example` para `.env.local` (ignorado pelo Git).
2. Defina `VITE_POSTHOG_ENABLED=true` e preencha `VITE_POSTHOG_KEY` com o **token público
   de ingestão** do projeto PostHog US 621293. O número do projeto não é esse token.
   Não use chave pessoal/administrativa. Host US: `https://us.i.posthog.com`.
3. Execute `pnpm dev` neste worktree e abra o endereço localhost informado pelo Vite.
4. No índice, use **Começar do início** na mesma aba e percorra cadastro → match de terapias
   → agendamento → Meus agendamentos. Confira os eventos no PostHog.

Sem token e ativação explícita, nenhum evento é enviado e nenhum estado de analytics é
persistido. A restrição a localhost foi removida a pedido do usuário em 22/09/2026.
Na Vercel, configure as mesmas variáveis no ambiente Production antes do build.
A coleta e o replay ficam ativos quando `VITE_POSTHOG_ENABLED=true` e há token público.
Sem essas condições, permanecem desligados em qualquer ambiente. O SDK é carregado sob demanda.

## Eventos e leitura dos resultados

Todos os eventos têm `flow=onboarding`, `flow_version=1`, `attempt_id` aleatório e `elapsed_ms`.
A tentativa começa **somente** no CTA do índice. Links diretos para telas, inclusive o Welcome,
não iniciam uma tentativa: servem para revisão visual e ficam fora deste funil.

| Evento | Quando / propriedades adicionais |
| --- | --- |
| `onboarding_started` | Clique no CTA, `entry=index_cta` |
| `onboarding_step_viewed` | Etapa válida, `step`, `phase`, `step_index`, `direction` (forward/backward) |
| `onboarding_step_completed` | Ação real da tela, `step`, `completion_kind`, `step_duration_ms` |
| `onboarding_step_left` | Transição/saída observada, `step`, `step_duration_ms` |
| `onboarding_phase_completed` | Marco de cada fluxo, `phase`, `phase_duration_ms` |
| `onboarding_booking_confirmed` | Clique em Agendar seguido do registro fictício da sessão |
| `onboarding_completed` | Chegada a Meus agendamentos após os três marcos e reserva confirmada |
| `onboarding_exited` | Saída observada da jornada, `step`, `reason` |
| `onboarding_blocked` | Validação existente impede avançar, `step`, `reason=validation_error` |

Marcos: cadastro passa de Em análise para Perfil aprovado; match de terapias passa de Suas
sessões para resultados; agendamento registra a reserva após confirmação. Cada marco é
emitido no máximo uma vez por tentativa. São conclusões **do protótipo**: não há aprovação
real do RH nem reserva de atendimento num backend. Abrir Sessão agendada diretamente continua
funcionando para revisão, mas não gera confirmação de analytics sem o clique anterior.

As saídas distinguem `skip_match` (confirmou Pular match), `explore_app` (Agora não),
`left_flow` (navegou para fora da jornada) e `restart` (novo começo). Não há evento de
"abandono" no fechamento, refresh, perda de foco ou unload. Saída observada é um comportamento,
não uma afirmação de intenção de desistir.

Para o relatório, use tentativas (`attempt_id`) como unidade, e uma janela de conversão de
**24 horas desde o início**. Conte como não concluídas/abandono operacional somente tentativas
cuja janela terminou sem `onboarding_completed`; tentativas recentes ainda estão em andamento.
A última etapa visitada permite localizar onde pararam. Compare separadamente saídas
explícitas e tentativas sem evento de saída. Por fluxo, o denominador é a primeira visita à
respectiva fase e o numerador é `onboarding_phase_completed` daquela fase. No PostHog,
configure os funis para manter `attempt_id` constante entre etapas e evitar juntar recomeços.

Tempos são de relógio, da primeira entrada até o marco: **incluem ociosidade, aba oculta e
esperas artificiais do protótipo**. Não representam tempo ativo de tarefa. A duração da última
etapa sem saída é desconhecida; não a estime como zero. A tentativa expira em 24h. Refresh
na mesma aba preserva a tentativa; fechamento da aba perde esse contexto. Uma nova tentativa
exige o CTA. Voltas são visitas com `direction=backward`; pulos são os motivos explícitos.

Os bloqueios cobrem as validações já existentes de código da empresa, dados pessoais e senha.
Não são um monitor de erros JavaScript ou falhas de backend. Botões desabilitados não disparam
cliques; portanto não contabilizamos tentativas de avançar nesses controles.

## Objetivo de cada tela e evidência disponível

`onboarding_step_viewed` significa apenas visualização. `onboarding_step_completed` é emitido
no manipulador da ação de avanço, após a validação quando ela existe; nunca por simplesmente
visitar a tela seguinte. `completion_kind` distingue `advance`, `validated`, `automatic` e
`skip_optional`. Não representa compreensão do conteúdo nem uma escolha deliberada de opções
que já estavam marcadas. É no máximo um evento por visita à etapa; voltar e avançar novamente
é outra visita, mantendo a mesma tentativa.

| Tela | Objetivo observável / gatilho de conclusão | Evidência / limite |
| --- | --- | --- |
| Splash | Terminar a espera inicial | `step_completed`, automatic; não é sucesso do usuário |
| Welcome | Acionar Identifique a sua empresa | `step_completed`, advance |
| Identificador da empresa | Código aceito pela simulação | `step_completed`, validated; código rejeitado gera blocked; não há consulta real |
| Empresa encontrada | Acionar a continuação com a empresa exibida | `step_completed`, advance; voltar é apenas retorno |
| Contrato de confiança | Acionar Eu concordo, continuar | `step_completed`, advance; não comprova leitura |
| Dados pessoais | Enviar formulário aceito pelas validações locais | `step_completed`, validated; erro gera blocked; nenhum campo é enviado |
| Senha | Enviar senha e confirmação aceitas localmente | `step_completed`, validated; erro gera blocked; não coleta senha |
| Em análise | Terminar espera simulada | `step_completed`, automatic; não é aprovação real do RH |
| Perfil aprovado | Acionar Agendar primeiro atendimento | `step_completed`, advance; marco cadastro ocorre ao chegar após análise |
| Início do match de terapias | Acionar início do questionário | `step_completed`, advance; Agora não gera exited/explore_app |
| Seu momento | Continuar ou Não sei ainda | `step_completed`, advance ou skip_optional; não coleta temas nem alterações de seleção |
| Especialidade | Continuar ou Não tenho preferência | `step_completed`, advance ou skip_optional; não coleta especialidades |
| Suas sessões | Acionar busca com a seleção permitida pela interface | `step_completed`, advance; valores podem ser os pré-selecionados |
| Sessões recomendadas | Acionar Ver agenda | `step_completed`, advance; não prova que encontrou a melhor terapia; nenhum profissional é enviado |
| Detalhes da sessão | Acionar Agendar com… | `step_completed`, advance; não comprova leitura da descrição |
| Escolher data e horário | Acionar Confirmar informações com horário presente | `step_completed`, advance; pode aceitar horário pré-selecionado |
| Informações complementares | Acionar Confirmar informações | `step_completed`, advance; campos opcionais, sem validação de completude |
| Confirmar informações | Acionar Agendar | `step_completed`, advance; sucesso da reserva só em booking_confirmed após registro |
| Sessão agendada | Acionar Continuar para Meus agendamentos | `step_completed`, advance; a visualização isolada não comprova reserva |
| Meus agendamentos | Chegar após reserva e marcos dos três fluxos | `onboarding_completed`; não há novo objetivo de interação especificado |

Para taxa de conclusão de objetivo de tela, compare visitas com a ação correspondente dentro
da tentativa; não use a simples saída como sucesso. Separe automatic e skip_optional de
avanços validados. Se o objetivo esperado for diferente do comportamento descrito (por exemplo,
alterar a seleção padrão ou ler detalhes), esse objetivo ainda não foi especificado/medido.

## Limites de dados

Autocapture, pageviews automáticos, erros automáticos, heatmaps, performance e surveys
estão desligados. A consulta de configuração remota está habilitada para obter a configuração
de replay do projeto. O replay está habilitado no índice e nas rotas conhecidas do onboarding;
a navegação para outros destinos, incluindo o Diário, interrompe a gravação. Nenhuma pergunta ou nota ao final foi adicionada.
Não usamos `identify` nem criamos perfis pessoais. A interface de instrumentação não recebe
valores de formulários, respostas de saúde, profissionais, empresa, datas ou horários escolhidos.
No replay, todo texto é mascarado. Campos (inclusive hidden/file), cartões de opções, chips
de seleção, imagens, vídeos, canvas e iframes são substituídos por blocos. Atributos de texto,
identificadores e dados também são removidos; ficam apenas atributos de layout e SVG.
Console, corpos/cabeçalhos de rede, JSON-LD e captura de canvas estão desativados. URLs
da gravação perdem query string e fragmento. Isso reduz a fidelidade visual de propósito: a
gravação mostra navegação, rolagem e estrutura, sem o conteúdo pessoal.

O filtro `before_send` aceita somente os eventos e propriedades listados e `$snapshot`
com seu payload já mascarado pelo gravador, além dos
identificadores anônimos e campos de transporte necessários ao SDK. Remove URL, query string,
referrer, propriedades de pessoa e demais campos. Geolocalização está desativada e o IP na propriedade do evento é substituído por `0.0.0.0`. Como qualquer
requisição HTTP, o serviço recebe metadados de transporte; não se trata de anonimato absoluto.
Session storage guarda só a tentativa e os identificadores anônimos. Falhas de armazenamento
ou captura não interrompem o fluxo. O projeto PostHog foi conferido: Record user sessions
está ligado, com amostragem de 100% e sem duração mínima. As proteções locais prevalecem
sobre as configurações remotas de captura de console e rede.

## Verificação

- `pnpm test:analytics` (Node com suporte nativo a TypeScript; validado em Node 26): jornada,
  conclusões indevidas, repetição de efeitos, refresh, voltas, expiração, pulos, tempo e filtro.
- `pnpm build`: TypeScript e bundle de produção.
- Entrega real confirmada no painel Activity do projeto 621293: `onboarding_started`,
  `onboarding_step_viewed`, `onboarding_step_completed` e `onboarding_step_left`, vindos do
  teste local em `http://127.0.0.1:5180/`. Dashboard ainda não criado. A jornada completa
  foi validada por testes automatizados; não foi percorrida integralmente com o token real.
- A inspeção dos primeiros eventos mostrou que a ingestão acrescenta o IP de conexão,
  mesmo com `ip: false` e `$geoip_disable: true`. O filtro agora força `$ip: 0.0.0.0`,
  coberto pelo teste de privacidade. Os eventos iniciais já armazenados não foram apagados.
  A confirmação visual do IP substituto no evento posterior ficou pendente porque o
  navegador foi retomado pelo usuário durante a inspeção. Nenhum valor de formulário
  foi preenchido ou transmitido neste teste.

Vercel confirmado por status de deploy do GitHub: deployment `6577271114`, `success`, commit
`9d3ef48b280868701e8c2c6f4e40b4f3ecaf2913`,
[preview daquele deploy](https://prot-tipo-guia-da-alma-colaborador-oqdf1czar-rootmaister.vercel.app).
Essa URL não contém esta integração local.

Referências: [instalação React](https://posthog.com/docs/libraries/react) e
[configuração do SDK](https://posthog.com/docs/libraries/js/config).

## Verificação da ativação em 22/09/2026

O gravador real foi exercitado em navegador local com dados fictícios. O payload de snapshot
foi inspecionado por diagnóstico temporário: continha estrutura, textos mascarados e blocos,
sem o nome/e-mail de teste. O diagnóstico foi removido antes do commit; nenhuma amostra
de conteúdo foi gravada no repositório. Os testes também cobrem máscaras e transporte de
snapshots. A ativação final em produção depende do build com as variáveis da Vercel.
