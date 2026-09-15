'use client'

import { useEffect, useId, useRef, useState } from 'react'

type Props = {
  aberto: boolean
  itens: string[]
  nomeInicial: string
  sobrenomeInicial: string
  salvando: boolean
  erro: string | null
  aoFechar: () => void
  aoConfirmar: (nome: string, sobrenome: string) => void
}

export default function ModalNome({
  aberto,
  itens,
  nomeInicial,
  sobrenomeInicial,
  salvando,
  erro,
  aoFechar,
  aoConfirmar,
}: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const primeiro = useRef<HTMLInputElement>(null)
  const [nome, setNome] = useState(nomeInicial)
  const [sobrenome, setSobrenome] = useState(sobrenomeInicial)
  const id = useId()

  /* Abre e fecha de verdade: <dialog> nos da foco preso e Esc de graca. */
  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (aberto && !d.open) {
      setNome(nomeInicial)
      setSobrenome(sobrenomeInicial)
      d.showModal()
      window.setTimeout(() => primeiro.current?.focus(), 60)
    }
    if (!aberto && d.open) d.close()
  }, [aberto, nomeInicial, sobrenomeInicial])

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (salvando) return
    aoConfirmar(nome.trim(), sobrenome.trim())
  }

  return (
    <dialog
      ref={dialogo}
      className="modal"
      aria-labelledby={`${id}-titulo`}
      onCancel={(e) => {
        e.preventDefault()
        if (!salvando) aoFechar()
      }}
      onClick={(e) => {
        if (e.target === dialogo.current && !salvando) aoFechar()
      }}
    >
      <form className="modal__papel" onSubmit={enviar}>
        <p className="sobrescrito sobrescrito--escuro">Quase lá</p>
        <h2 className="modal__titulo" id={`${id}-titulo`}>
          Quem está levando?
        </h2>
        <p className="modal__texto">
          Seu nome fica ao lado {itens.length === 1 ? 'do presente' : 'dos presentes'} na lista,
          para ninguém escolher o mesmo.
        </p>

        {itens.length > 0 && (
          <ul className="modal__itens">
            {itens.map((nomeItem) => (
              <li key={nomeItem}>{nomeItem}</li>
            ))}
          </ul>
        )}

        <div className="modal__campos">
          <label className="campo">
            <span className="campo__rotulo">Nome</span>
            <input
              ref={primeiro}
              className="campo__entrada"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="given-name"
              maxLength={30}
              required
            />
          </label>
          <label className="campo">
            <span className="campo__rotulo">Sobrenome</span>
            <input
              className="campo__entrada"
              name="sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              autoComplete="family-name"
              maxLength={40}
              required
            />
          </label>
        </div>

        <p className="modal__erro" role="alert">
          {erro ?? ''}
        </p>

        <div className="modal__acoes">
          <button
            type="button"
            className="botao botao--fantasma"
            onClick={aoFechar}
            disabled={salvando}
          >
            Voltar
          </button>
          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? 'Reservando…' : 'Confirmar'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
