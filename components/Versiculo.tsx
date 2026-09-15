import { Filete } from './Ornamentos'

export default function Versiculo() {
  return (
    <section className="versiculo" aria-labelledby="versiculo-titulo">
      <div className="versiculo__corpo">
        <p className="versiculo__ref" id="versiculo-titulo">
          1 Coríntios 13:4-7
        </p>

        <blockquote className="versiculo__texto">
          <p>
            “O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.”
          </p>
          <p>“Tudo sofre, tudo crê, tudo espera, tudo suporta.”</p>
        </blockquote>

        <Filete className="versiculo__filete" />
      </div>
    </section>
  )
}
