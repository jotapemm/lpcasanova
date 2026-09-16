import { COUPLE_LINE, EVENT, whatsappLink } from '@/lib/event'
import Botao from './Botao'
import Petalas from './Petalas'

export default function Rodape() {
  return (
    <footer className="rodape">
      <Petalas />

      <div className="rodape__corpo">
        <p className="rodape__frase">
          Toda casa começa vazia.
          <br />A nossa começa cheia de gente.
        </p>

        <Botao variante="wa" href={whatsappLink()} target="_blank" rel="noreferrer">
          Confirmar presença no WhatsApp
        </Botao>
        <p className="rodape__fone">{EVENT.whatsapp.label}</p>

        <p className="rodape__assinatura">
          {COUPLE_LINE} · {EVENT.date.month} de {EVENT.date.year}
        </p>
      </div>
    </footer>
  )
}
