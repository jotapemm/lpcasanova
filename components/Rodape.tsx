import { COUPLE_LINE, EVENT, whatsappLink } from '@/lib/event'
import { Ramo } from './Ornamentos'

export default function Rodape() {
  return (
    <footer className="rodape">
      <Ramo className="rodape__ramo" />
      <div className="rodape__corpo">
        <p className="rodape__frase">
          Toda casa começa vazia.
          <br />A nossa começa cheia de gente.
        </p>

        <a className="botao botao--claro" href={whatsappLink()} target="_blank" rel="noreferrer">
          Confirmar presença no WhatsApp
        </a>
        <p className="rodape__fone">{EVENT.whatsapp.label}</p>

        <p className="rodape__assinatura">
          {COUPLE_LINE} · {EVENT.date.month} de {EVENT.date.year}
        </p>
      </div>
    </footer>
  )
}
