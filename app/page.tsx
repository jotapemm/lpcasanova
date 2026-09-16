import Camadas from '@/components/Camadas'
import Convite from '@/components/Convite'
import { Divisor } from '@/components/Ornamentos'
import Presentes from '@/components/Presentes'
import Rodape from '@/components/Rodape'
import Versiculo from '@/components/Versiculo'
import { listar, modo } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Pagina() {
  /* Primeira pintura ja sai com a lista correta; o cliente assume depois. */
  const reservas = await listar()

  return (
    <>
      {/* Efeito cortina: o convite fica preso atras e o palco sobe por cima dele.
          Os dois moram na mesma .cena de proposito — assim o convite so fica
          preso enquanto a cena passa, e larga a tela antes do rodape. */}
      <div className="cena">
        <Convite />
        <main className="palco">
          <Divisor className="divisor" />
          <Versiculo />
          <Presentes reservasIniciais={reservas} modoInicial={modo()} />
          <Divisor className="divisor" />
        </main>
      </div>

      {/* Preso no fundo da janela, atras da cena: aparece quando o palco termina. */}
      <Rodape />
      <Camadas />
    </>
  )
}
