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
      <Convite />
      <Divisor className="divisor" />
      <Versiculo />
      <Presentes reservasIniciais={reservas} modoInicial={modo()} />
      <Divisor className="divisor" />
      <Rodape />
    </>
  )
}
