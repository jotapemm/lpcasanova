'use client'

import { useEffect, useRef } from 'react'
import { EVENT, whatsappLink } from '@/lib/event'
import { GIFT_NAME } from '@/lib/gifts'
import Botao from './Botao'

type Slot = { id: string; nome: string; travado: boolean } | null

type Props = {
  meus: string[]
  escolhas: string[]
  nomeConfirmado: string
  salvando: boolean
  aviso: string | null
  aoRemover: (id: string) => void
  aoDevolver: (id: string) => void
  aoConfirmar: () => void
}

export default function CartaoResposta({
  meus,
  escolhas,
  nomeConfirmado,
  salvando,
  aviso,
  aoRemover,
  aoDevolver,
  aoConfirmar,
}: Props) {
  const caixa = useRef<HTMLDivElement>(null)
  const aberto = meus.length + escolhas.length > 0

  /* O cartao e fixo: devolve a altura dele como respiro no fim da pagina. */
  useEffect(() => {
    const el = caixa.current
    const raiz = document.documentElement
    if (!el) return
    if (!aberto) {
      raiz.style.setProperty('--cartao-h', '0px')
      return
    }
    const medir = () => raiz.style.setProperty('--cartao-h', `${el.offsetHeight}px`)
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(el)
    return () => {
      obs.disconnect()
      raiz.style.setProperty('--cartao-h', '0px')
    }
  }, [aberto])

  const slots: Slot[] = []
  for (const id of meus) slots.push({ id, nome: GIFT_NAME.get(id) ?? id, travado: true })
  for (const id of escolhas) slots.push({ id, nome: GIFT_NAME.get(id) ?? id, travado: false })
  while (slots.length < EVENT.maxPicks) slots.push(null)

  const sobrando = EVENT.maxPicks - meus.length
  const pendentes = escolhas.length > 0

  return (
    <div className={`cartao${aberto ? ' e-aberto' : ''}`} aria-hidden={!aberto}>
      <div className="cartao__papel" ref={caixa}>
        <div className="cartao__interno">
          <div className="cartao__topo">
            <p className="sobrescrito sobrescrito--escuro">Vou levar</p>
            <p className="cartao__contagem">
              {meus.length + escolhas.length} de {EVENT.maxPicks}
            </p>
          </div>

          <ol className="linhas">
            {slots.slice(0, EVENT.maxPicks).map((slot, i) => (
              <li className={`linha${slot ? ' e-escrita' : ''}`} key={slot?.id ?? `vazio-${i}`}>
                <span className="linha__n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="linha__papel">
                  {slot?.travado && <span className="linha__selo" aria-hidden="true" />}
                  {slot && (
                    <span className="linha__valor" title={slot.nome}>
                      {slot.nome}
                    </span>
                  )}
                </span>
                {slot && (
                  <button
                    type="button"
                    className="linha__tirar"
                    onClick={() => (slot.travado ? aoDevolver(slot.id) : aoRemover(slot.id))}
                    disabled={salvando}
                  >
                    <span className="sr">
                      {slot.travado ? `Devolver ${slot.nome} para a lista` : `Tirar ${slot.nome}`}
                    </span>
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </li>
            ))}
          </ol>

          <p className="cartao__aviso" role="status">
            {aviso ?? ''}
          </p>

          <div className="cartao__acoes">
            {pendentes ? (
              <>
                <p className="cartao__nota">
                  {meus.length > 0
                    ? `Você já tem ${meus.length} reservado${meus.length === 1 ? '' : 's'}.`
                    : 'Confirme para os presentes saírem da lista.'}
                </p>
                <Botao onClick={aoConfirmar} disabled={salvando}>
                  {salvando ? 'Reservando…' : 'Confirmar escolha'}
                </Botao>
              </>
            ) : (
              <>
                <p className="cartao__nota">
                  <span className="cartao__selo" aria-hidden="true" />
                  Reservado
                  {nomeConfirmado ? ` por ${nomeConfirmado}` : ''}.
                  {sobrando > 0
                    ? ` Dá para escolher mais ${sobrando}.`
                    : ' Sua lista está completa.'}
                </p>
                <Botao
                  variante="wa"
                  href={whatsappLink(meus.map((id) => GIFT_NAME.get(id) ?? id))}
                  target="_blank"
                  rel="noreferrer"
                >
                  Avisar no WhatsApp
                </Botao>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
