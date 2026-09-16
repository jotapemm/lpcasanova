'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ALL_GIFTS, GIFT_NAME, TOTAL_GIFTS } from '@/lib/gifts'
import Botao from './Botao'

type Reserva = { id: string; nome: string; quando: number }

const CHAVE = 'cha.painel'

/* Ordem do catalogo (cozinha, banheiro, quarto e sala), pra lista de cada
   convidado sair na mesma ordem do site. */
const ORDEM = new Map(ALL_GIFTS.map((g, i) => [g.id, i]))

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

/* A senha fica so na sessao da aba: recarregar nao pede de novo, fechar a aba pede. */
function lerSenha() {
  try {
    return sessionStorage.getItem(CHAVE) ?? ''
  } catch {
    return ''
  }
}

function guardarSenha(senha: string) {
  try {
    if (senha) sessionStorage.setItem(CHAVE, senha)
    else sessionStorage.removeItem(CHAVE)
  } catch {
    /* navegador sem armazenamento: so vai pedir a senha de novo ao recarregar */
  }
}

export default function Admin() {
  const [senha, setSenha] = useState('')
  const [digitada, setDigitada] = useState('')
  const [reservas, setReservas] = useState<Reserva[] | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [confirmando, setConfirmando] = useState<string | null>(null)

  const sair = useCallback(() => {
    guardarSenha('')
    setSenha('')
    setReservas(null)
    setAviso(null)
  }, [])

  const carregar = useCallback(
    async (tentativa: string) => {
      setOcupado(true)
      setErro(null)
      try {
        const res = await fetch('/api/admin', {
          headers: { 'x-senha': tentativa },
          cache: 'no-store',
        })
        const dados = await res.json().catch(() => ({}))
        if (!res.ok) {
          if (res.status === 401) sair()
          setErro(dados?.mensagem ?? 'Não deu para abrir o painel agora.')
          return
        }
        guardarSenha(tentativa)
        setSenha(tentativa)
        setReservas(dados.reservas)
      } catch {
        setErro('Sem conexão com o servidor. Tente de novo.')
      } finally {
        setOcupado(false)
      }
    },
    [sair],
  )

  useEffect(() => {
    const guardada = lerSenha()
    if (guardada) carregar(guardada)
  }, [carregar])

  /* "Confirmar liberação" volta a ser "Liberar" se ninguém clicar em 4 segundos. */
  useEffect(() => {
    if (!confirmando) return
    const relogio = window.setTimeout(() => setConfirmando(null), 4000)
    return () => window.clearTimeout(relogio)
  }, [confirmando])

  async function liberar(id: string) {
    if (confirmando !== id) {
      setConfirmando(id)
      return
    }
    setConfirmando(null)
    setOcupado(true)
    setErro(null)
    setAviso(null)
    try {
      const res = await fetch('/api/admin/liberar', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-senha': senha },
        body: JSON.stringify({ itens: [id] }),
      })
      const dados = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 401) sair()
        setErro(dados?.mensagem ?? 'Não deu para liberar agora. Tente de novo.')
        return
      }
      setReservas(dados.reservas)
      setAviso(`${GIFT_NAME.get(id) ?? 'O presente'} voltou para a lista.`)
    } catch {
      setErro('Sem conexão com o servidor. Tente de novo.')
    } finally {
      setOcupado(false)
    }
  }

  const porConvidado = useMemo(() => {
    const grupos = new Map<string, Reserva[]>()
    for (const r of reservas ?? []) grupos.set(r.nome, [...(grupos.get(r.nome) ?? []), r])
    return [...grupos]
      .map(([nome, itens]) => ({
        nome,
        itens: itens.sort((a, b) => (ORDEM.get(a.id) ?? 0) - (ORDEM.get(b.id) ?? 0)),
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [reservas])

  if (!senha || !reservas) {
    return (
      <main className="painel">
        <div className="painel__cabecalho">
          <p className="sobrescrito sobrescrito--escuro">Só para os noivos</p>
          <h1 className="titulo">Painel</h1>
          <p className="painel__texto">
            Aqui vocês veem quem vai levar cada presente e podem devolver um item para a lista
            quando um convidado pedir.
          </p>
        </div>

        <form
          className="painel__entrada"
          onSubmit={(e) => {
            e.preventDefault()
            if (digitada) carregar(digitada)
          }}
        >
          <label className="campo">
            <span className="campo__rotulo">Senha</span>
            <input
              className="campo__entrada"
              type="password"
              autoComplete="current-password"
              value={digitada}
              onChange={(e) => setDigitada(e.target.value)}
              required
            />
          </label>
          <p className="painel__erro" role="alert">
            {erro ?? ''}
          </p>
          <Botao type="submit" disabled={ocupado}>
            {ocupado ? 'Entrando…' : 'Entrar'}
          </Botao>
        </form>
      </main>
    )
  }

  const convidados = porConvidado.length

  return (
    <main className="painel">
      <div className="painel__cabecalho">
        <p className="sobrescrito sobrescrito--escuro">Só para os noivos</p>
        <h1 className="titulo">Quem leva o quê</h1>
        <p className="painel__resumo">
          {reservas.length} de {TOTAL_GIFTS} presentes reservados · {convidados}{' '}
          {convidados === 1 ? 'convidado' : 'convidados'}
        </p>
        <div className="painel__acoes">
          <Botao onClick={() => carregar(senha)} disabled={ocupado}>
            {ocupado ? 'Atualizando…' : 'Atualizar'}
          </Botao>
          <Botao variante="fantasma" onClick={sair}>
            Sair
          </Botao>
        </div>
        <p className="painel__erro" role="alert">
          {erro ?? ''}
        </p>
        <p className="painel__aviso" role="status">
          {aviso ?? ''}
        </p>
      </div>

      {convidados === 0 ? (
        <p className="painel__texto">
          Ninguém reservou nada ainda. Quando um convidado confirmar, o nome dele aparece aqui.
        </p>
      ) : (
        <ul className="painel__lista">
          {porConvidado.map(({ nome, itens }) => (
            <li className="convidado" key={nome}>
              <h2 className="convidado__nome">{nome}</h2>
              <ul>
                {itens.map((r) => {
                  const presente = GIFT_NAME.get(r.id) ?? r.id
                  const pedindo = confirmando === r.id
                  return (
                    <li className="reserva" key={r.id}>
                      <span className="reserva__item">{presente}</span>
                      <span className="reserva__quando">
                        {r.quando ? formatoData.format(r.quando) : '—'}
                      </span>
                      <button
                        type="button"
                        className={`reserva__liberar${pedindo ? ' e-confirmando' : ''}`}
                        onClick={() => liberar(r.id)}
                        disabled={ocupado}
                      >
                        {pedindo ? 'Confirmar liberação' : 'Liberar'}
                        <span className="sr">
                          {' '}
                          {presente} de {nome}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <Link className="elo painel__voltar" href="/">
        Voltar para o convite
      </Link>
    </main>
  )
}
