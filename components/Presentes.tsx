'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EVENT } from '@/lib/event'
import { CATEGORIES, GIFT_NAME, TOTAL_GIFTS } from '@/lib/gifts'
import type { Modo, Reservas } from '@/lib/tipos'
import CartaoResposta from './CartaoResposta'
import ModalNome from './ModalNome'

type Props = { reservasIniciais: Reservas; modoInicial: Modo }

const CHAVE_ID = 'cha.convidado'
const CHAVE_NOME = 'cha.nome'
const CHAVE_SOBRENOME = 'cha.sobrenome'

function novoId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* navegador antigo ou contexto inseguro */
  }
  return `g-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

function guarda(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor)
  } catch {
    /* modo anonimo com armazenamento bloqueado */
  }
}

function busca(chave: string) {
  try {
    return localStorage.getItem(chave) ?? ''
  } catch {
    return ''
  }
}

export default function Presentes({ reservasIniciais, modoInicial }: Props) {
  const [reservas, setReservas] = useState<Reservas>(reservasIniciais)
  const [modo, setModo] = useState<Modo>(modoInicial)
  const [escolhas, setEscolhas] = useState<string[]>([])
  const [convidado, setConvidado] = useState('')
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [erroModal, setErroModal] = useState<string | null>(null)
  const [carimbados, setCarimbados] = useState<string[]>([])

  /* Identidade anonima do navegador — so serve para o convidado poder
     devolver o proprio presente depois. */
  useEffect(() => {
    let id = busca(CHAVE_ID)
    if (!id) {
      id = novoId()
      guarda(CHAVE_ID, id)
    }
    setConvidado(id)
    setNome(busca(CHAVE_NOME))
    setSobrenome(busca(CHAVE_SOBRENOME))
  }, [])

  /* `focus` e `visibilitychange` disparam juntos ao voltar para a aba;
     sem esta trava a lista seria buscada duas vezes a cada troca. */
  const ultimaBusca = useRef(0)

  const atualizar = useCallback(async (id: string) => {
    const agora = Date.now()
    if (agora - ultimaBusca.current < 2000) return
    ultimaBusca.current = agora
    try {
      const res = await fetch(`/api/itens?g=${encodeURIComponent(id)}`, { cache: 'no-store' })
      if (!res.ok) return
      const dados = await res.json()
      if (dados?.reservas) setReservas(dados.reservas)
      if (dados?.modo) setModo(dados.modo)
    } catch {
      /* offline: mantem o que ja esta na tela */
    }
  }, [])

  /* A lista e disputada: recarrega de tempos em tempos e ao voltar para a aba. */
  useEffect(() => {
    if (!convidado) return
    atualizar(convidado)
    const relogio = window.setInterval(() => atualizar(convidado), 25000)
    const aoVoltar = () => {
      if (!document.hidden) atualizar(convidado)
    }
    window.addEventListener('focus', aoVoltar)
    document.addEventListener('visibilitychange', aoVoltar)
    return () => {
      window.clearInterval(relogio)
      window.removeEventListener('focus', aoVoltar)
      document.removeEventListener('visibilitychange', aoVoltar)
    }
  }, [convidado, atualizar])

  const meus = useMemo(
    () => Object.keys(reservas).filter((id) => reservas[id].mine),
    [reservas],
  )
  const disponiveis = TOTAL_GIFTS - Object.keys(reservas).length
  const restantes = EVENT.maxPicks - meus.length - escolhas.length

  function alternar(id: string) {
    if (reservas[id]) return

    if (escolhas.includes(id)) {
      setAviso(null)
      setEscolhas((atual) => atual.filter((x) => x !== id))
      return
    }

    if (restantes <= 0) {
      setAviso(
        meus.length >= EVENT.maxPicks
          ? `Você já reservou ${EVENT.maxPicks} presentes. Devolva um para trocar.`
          : `São ${EVENT.maxPicks} presentes por convidado. Tire um da lista para incluir outro.`,
      )
      return
    }

    setAviso(null)
    setEscolhas((atual) => (atual.includes(id) ? atual : [...atual, id]))
  }

  async function confirmar(n: string, s: string) {
    setSalvando(true)
    setErroModal(null)
    try {
      const res = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ guestId: convidado, nome: n, sobrenome: s, itens: escolhas }),
      })
      const dados = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (dados?.reservas) setReservas(dados.reservas)
        if (dados?.modo) setModo(dados.modo)
        setErroModal(dados?.mensagem ?? 'Não deu para reservar agora. Tente de novo.')
        return
      }

      guarda(CHAVE_NOME, n)
      guarda(CHAVE_SOBRENOME, s)
      setNome(n)
      setSobrenome(s)
      setReservas(dados.reservas)
      if (dados.modo) setModo(dados.modo)
      setEscolhas([])
      setModalAberto(false)
      setAviso(dados.aviso ?? null)

      if (dados.ganhos?.length) {
        setCarimbados(dados.ganhos)
        window.setTimeout(() => setCarimbados([]), 2100)
      }
    } catch {
      setErroModal('Sem conexão com o servidor. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  async function devolver(id: string) {
    setSalvando(true)
    setAviso(null)
    try {
      const res = await fetch('/api/devolver', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ guestId: convidado, itens: [id] }),
      })
      const dados = await res.json().catch(() => ({}))
      if (dados?.reservas) setReservas(dados.reservas)
      if (dados?.modo) setModo(dados.modo)
      setAviso(`${GIFT_NAME.get(id) ?? 'O presente'} voltou para a lista.`)
    } catch {
      setAviso('Sem conexão. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  const nomeConfirmado = meus.length ? reservas[meus[0]].name : ''

  return (
    <section className="presentes" id="presentes">
      {modo === 'memoria' && (
        <p className="alerta" role="status">
          Modo de demonstração: as escolhas não estão sendo salvas. Configure o banco de dados
          (veja o README) antes de mandar o link para os convidados.
        </p>
      )}

      <div className="presentes__corpo">
        <div className="presentes__cabecalho">
          <h2 className="titulo">Lista de presentes</h2>
          <p className="presentes__regra">
            Escolha até {EVENT.maxPicks} presentes. Quando você confirma, eles saem da lista —
            assim ninguém leva o mesmo item duas vezes.
          </p>
          <p className="presentes__contagem" role="status">
            <strong>{disponiveis}</strong> de {TOTAL_GIFTS} ainda disponíveis
          </p>
        </div>

        {CATEGORIES.map((cat) => (
          <div className="grupo" key={cat.id}>
            <h3 className="grupo__titulo">{cat.name}</h3>
            <ul className="grade">
              {cat.items.map((g) => {
                const r = reservas[g.id]
                const meu = !!r?.mine
                const tomado = !!r && !r.mine
                const escolhido = escolhas.includes(g.id)
                const carimbo = carimbados.includes(g.id)
                const classe = [
                  'item',
                  meu && 'e-meu',
                  tomado && 'e-tomado',
                  escolhido && 'e-escolhido',
                ]
                  .filter(Boolean)
                  .join(' ')

                const miolo = (
                  <>
                    <span className="item__marca" aria-hidden="true" />
                    <span className="item__texto">
                      <span className="item__nome">{g.name}</span>
                      {tomado && <span className="item__quem">Reservado por {r.name}</span>}
                      {meu && (
                        <span className="item__quem item__quem--meu">Você leva este presente</span>
                      )}
                    </span>
                  </>
                )

                return (
                  <li className={classe} key={g.id}>
                    {meu || tomado ? (
                      <div className="item__corpo">
                        {miolo}
                        {meu && (
                          <button
                            type="button"
                            className="item__devolver"
                            onClick={() => devolver(g.id)}
                            disabled={salvando}
                          >
                            Devolver
                            <span className="sr"> {g.name} para a lista</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* No limite o botao continua clicavel de proposito:
                         apagar 46 linhas parece defeito, e o clique explica. */
                      <button
                        type="button"
                        className="item__corpo item__corpo--clicavel"
                        onClick={() => alternar(g.id)}
                        aria-pressed={escolhido}
                        aria-disabled={!escolhido && restantes <= 0}
                        disabled={salvando}
                      >
                        {miolo}
                      </button>
                    )}
                    {carimbo && (
                      <span className="carimbo" aria-hidden="true">
                        Reservado
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <CartaoResposta
        meus={meus}
        escolhas={escolhas}
        nomeConfirmado={nomeConfirmado}
        salvando={salvando}
        aviso={aviso}
        aoRemover={(id) => setEscolhas((a) => a.filter((x) => x !== id))}
        aoDevolver={devolver}
        aoConfirmar={() => {
          setErroModal(null)
          setModalAberto(true)
        }}
      />

      <ModalNome
        aberto={modalAberto}
        itens={escolhas.map((id) => GIFT_NAME.get(id) ?? id)}
        nomeInicial={nome}
        sobrenomeInicial={sobrenome}
        salvando={salvando}
        erro={erroModal}
        aoFechar={() => setModalAberto(false)}
        aoConfirmar={confirmar}
      />
    </section>
  )
}
