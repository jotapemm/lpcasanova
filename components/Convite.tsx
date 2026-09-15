import { EVENT, mapaLink } from '@/lib/event'
import { Ramo } from './Ornamentos'

export default function Convite() {
  const { couple, date, place } = EVENT

  return (
    <header className="convite">
      <Ramo className="convite__ramo convite__ramo--esq" />
      <Ramo className="convite__ramo convite__ramo--dir" />

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
          <p className="sobrescrito sobrescrito--claro">Onde</p>
          <p className="local__linha">{place.line1}</p>
          <p className="local__linha local__linha--fraca">{place.line2}</p>
          <a className="elo" href={mapaLink} target="_blank" rel="noreferrer">
            Abrir no mapa
          </a>
        </div>

        <a className="descer reveal d6" href="#presentes">
          <span>Escolher um presente</span>
          <svg viewBox="0 0 14 26" aria-hidden="true" focusable="false">
            <path
              d="M7 0 V 22 M1.5 16.5 L7 23 L12.5 16.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </header>
  )
}
