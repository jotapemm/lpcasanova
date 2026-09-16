'use client'

import { useEffect } from 'react'

/**
 * Mede o convite e o rodape e entrega as alturas pro CSS (--convite-h e
 * --rodape-h). O sticky precisa delas pra saber quando congelar cada tela:
 * se a tela for mais alta que a janela, ela rola ate aparecer inteira e so
 * entao para — senao o "Escolher um presente" do fim do convite nunca seria
 * visto num celular.
 *
 * Nao desenha nada: so observa e mede.
 */
export default function Camadas() {
  useEffect(() => {
    const raiz = document.documentElement
    const convite = document.querySelector<HTMLElement>('.convite')
    const rodape = document.querySelector<HTMLElement>('.rodape')
    const palco = document.querySelector<HTMLElement>('.palco')
    if (!convite || !rodape || !palco) return

    const medir = () => {
      raiz.style.setProperty('--convite-h', `${convite.offsetHeight}px`)
      raiz.style.setProperty('--rodape-h', `${rodape.offsetHeight}px`)
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(convite)
    observador.observe(rodape)

    /* Quem navega pelo teclado pode cair num link que o palco esta cobrindo.
       O navegador acha que ele ja esta na tela (e sticky) e nao rola sozinho,
       entao o anel de foco ficaria escondido embaixo do conteudo. */
    const folga = 24
    const aoFocar = (e: FocusEvent) => {
      const alvo = e.target
      if (!(alvo instanceof HTMLElement)) return
      const r = alvo.getBoundingClientRect()
      const p = palco.getBoundingClientRect()

      if (convite.contains(alvo) && p.top < r.bottom + folga) {
        window.scrollBy({ top: -(r.bottom + folga - p.top), behavior: 'instant' })
      } else if (rodape.contains(alvo) && p.bottom > r.top - folga) {
        window.scrollBy({ top: p.bottom - (r.top - folga), behavior: 'instant' })
      }
    }
    document.addEventListener('focusin', aoFocar)

    return () => {
      observador.disconnect()
      document.removeEventListener('focusin', aoFocar)
    }
  }, [])

  return null
}
