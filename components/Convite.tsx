import { EVENT, mapaLink } from '@/lib/event'
import Petalas from './Petalas'

export default function Convite() {
  const { couple, date, place } = EVENT

  return (
    <header className="convite">
      <Petalas />

      <div className="convite__corpo">
        <p className="sobrescrito reveal d1">Convite</p>

        <h1 className="nomes reveal d2">
          <span className="nomes__linha">{couple.first}</span>
          <span className="nomes__linha">e {couple.second}</span>
        </h1>

        <p className="manuscrito reveal d3">Chá de casa nova</p>

        <div className="data reveal d4">
          <span className="data__mes">{date.month}</span>
          <div className="data__linha">
            <span className="data__lado">{date.weekday}</span>
            <span className="data__dia">{date.day}</span>
            <span className="data__lado">{date.time}</span>
          </div>
          <span className="data__ano">{date.year}</span>
        </div>

        <div className="local reveal d5">
          <p className="manuscrito manuscrito--pequeno">Local</p>
          <p className="local__linha">{place.line1}</p>
          <p className="local__linha local__linha--fraca">{place.line2}</p>
          <a className="elo" href={mapaLink} target="_blank" rel="noreferrer">
            Abrir no mapa
          </a>
        </div>
      </div>
    </header>
  )
}
