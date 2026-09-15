import { Bagas, Ramo } from './Ornamentos'

export default function Versiculo() {
  return (
    <section className="versiculo" aria-labelledby="versiculo-titulo">
      <Ramo className="planta planta--versiculo-esq" />
      <Ramo className="planta planta--versiculo-dir" />
      <Bagas className="planta planta--versiculo-baga" />

      <div className="versiculo__corpo">
        <p className="versiculo__convite">
          Uma nova fase se inicia em nossas vidas, e convidamos você para comemorar conosco!
        </p>

        <p className="versiculo__ref" id="versiculo-titulo">
          1 Coríntios 13:4-7
        </p>

        <blockquote className="versiculo__texto">
          <p>
            “O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.”
          </p>
          <p>“Tudo sofre, tudo crê, tudo espera, tudo suporta.”</p>
        </blockquote>
      </div>
    </section>
  )
}
