import { COUPLE_LINE, EVENT, whatsappLink } from '@/lib/event'
import Botao from './Botao'
import { Bagas, Ramo, Samambaia } from './Ornamentos'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="folhagem folhagem--rodape" aria-hidden="true">
        <Ramo className="planta planta--r1" />
        <Samambaia className="planta planta--r2" />
        <Bagas className="planta planta--r3" />
        <Samambaia className="planta planta--r4" />
        <Ramo className="planta planta--r5" />
      </div>

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
