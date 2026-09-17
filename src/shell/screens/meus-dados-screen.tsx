import { useState, type FormEvent } from 'react'

import { Button, IconButton, InputField } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { lerOrigem } from '@/lib/origem'
import { useConta } from '@/state/conta-provider'

/**
 * Meus dados — `2874:109` (mobile) e `2873:3` (desktop), página "Meus dados".
 *
 * É a primeira tela do app aberta **pelo perfil** e não pelo menu: a régua do desktop vem
 * com `Item ativo=Nenhum`, e o mobile não desenha a barra inferior, só um botão de voltar.
 * O que isso implica no chrome está em `shell/destinos.ts` (`peloPerfil`).
 *
 * Mobile e desktop são o mesmo formulário em duas formas: lá tudo empilha, aqui Nome e
 * Sobrenome dividem uma linha, Senha e Confirmar senha dividem outra, e "Atualizar" encolhe
 * para o seu texto em vez de ocupar a largura toda.
 *
 * Sem backend: "Atualizar" grava no `conta-provider`, que é o que faz o nome e as iniciais
 * mudarem no menu e na saudação do Início. A senha não é guardada em lugar nenhum — só
 * validada contra a confirmação, como a tela promete.
 */
export function MeusDadosScreen() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { conta, atualizarDados, reset } = useConta()

  const [nome, setNome] = useState(conta.nome)
  const [sobrenome, setSobrenome] = useState(conta.sobrenome)
  const [telefone, setTelefone] = useState(conta.telefone)
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState(false)

  const voltar = lerOrigem(search, '/app/inicio')

  function aoEnviar(evento: FormEvent) {
    evento.preventDefault()

    if (senha !== confirmacao) {
      setErro('As senhas não conferem.')
      setSalvo(false)
      return
    }

    setErro('')
    atualizarDados({ nome: nome.trim(), sobrenome: sobrenome.trim(), telefone: telefone.trim() })
    setSenha('')
    setConfirmacao('')
    setSalvo(true)
  }

  /**
   * "Sair da conta" não tem destino desenhado. O protótipo devolve a pessoa ao início do
   * Cadastro e zera a conta — é o único lugar do app que se parece com uma porta de entrada,
   * já que não há tela de login. Ver SYNC-FIGMA.md.
   */
  function sair() {
    reset()
    navigate('/cadastro/welcome')
  }

  return (
    <div className="flex flex-col gap-8 px-6 pt-4 pb-8 lg:px-0 lg:pt-20">
      {/* Só no mobile: no desktop a régua fica na tela e o desenho não traz o voltar. */}
      <IconButton
        icon={<ArrowLeftIcon className="size-[18px]" />}
        aria-label="Voltar"
        className="lg:hidden"
        onClick={() => navigate(voltar)}
      />

      <header className="flex flex-col gap-4">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-xxl text-fg-default">Meus dados</h1>
        <p className="text-body-m text-fg-subtle">
          Atualize suas informações de acesso e contato.
        </p>
      </header>

      {/*
        DS-GAP: `radius/xxl` do frame é 24px e a escala do DS para em `rounded-2xl` (16px) —
        a mesma lacuna dos cartões do Início e do `card-sessao`. Ver DS-GAPS.md.
      */}
      <form
        onSubmit={aoEnviar}
        className="bg-surface-base border-outline-subtle flex flex-col gap-6 rounded-2xl border p-6"
      >
        <InputField
          label="E-mail"
          type="email"
          value={conta.email}
          disabled
          readOnly
          helperText="O e-mail de acesso não pode ser alterado."
        />

        {/* Uma linha só no desktop; empilhadas no mobile. O `InputField` do DS não expõe
            classe do contêiner, então quem divide a linha é a `div` de fora. */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:flex-1">
            <InputField
              label="Nome"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>
          <div className="lg:flex-1">
            <InputField
              label="Sobrenome"
              value={sobrenome}
              onChange={(evento) => setSobrenome(evento.target.value)}
            />
          </div>
        </div>

        <InputField
          label="N° telefone"
          type="tel"
          value={telefone}
          onChange={(evento) => setTelefone(evento.target.value)}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="lg:flex-1">
            <InputField
              label="Senha"
              type="password"
              value={senha}
              placeholder="Nova senha"
              onChange={(evento) => setSenha(evento.target.value)}
              helperText="Deixe em branco para manter a senha atual."
            />
          </div>
          <div className="lg:flex-1">
            <InputField
              label="Confirmar senha"
              type="password"
              value={confirmacao}
              placeholder="Repita a nova senha"
              onChange={(evento) => setConfirmacao(evento.target.value)}
              error={erro || undefined}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2">
          {/* Largura total no mobile, encolhido no desktop — os dois frames desenham assim. */}
          <Button type="submit" variant="contained" className="w-full lg:w-auto">
            Atualizar
          </Button>

          {salvo ? (
            <p role="status" className="text-caption text-fg-subtle">
              Dados atualizados.
            </p>
          ) : null}
        </div>
      </form>

      <div className="flex justify-center">
        <Button variant="destructive" onClick={sair}>
          Sair da conta
        </Button>
      </div>
    </div>
  )
}
