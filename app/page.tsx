import Camadas from '@/components/Camadas'
import Convite from '@/components/Convite'
import { Divisor } from '@/components/Ornamentos'
import Presentes from '@/components/Presentes'
import Rodape from '@/components/Rodape'
import Versiculo from '@/components/Versiculo'
import { listar, modo } from '@/lib/store'
import type { Reservas } from '@/lib/tipos'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* Quanto o convite espera pelo banco antes de abrir sem a lista. Quando o
   banco cai, o Upstash tenta de novo 5 vezes, esperando cada vez mais —
   segundos de tela em branco. Melhor abrir logo: o navegador busca a lista
   sozinho assim que a pagina carrega. */
const PRAZO_DO_BANCO_MS = 2000

function comPrazo<T>(promessa: Promise<T>, ms: number): Promise<T> {
  let relogio: ReturnType<typeof setTimeout> | undefined
  const prazo = new Promise<never>((_, falhar) => {
    relogio = setTimeout(() => falhar(new Error(`o banco nao respondeu em ${ms}ms`)), ms)
  })
  return Promise.race([promessa, prazo]).finally(() => clearTimeout(relogio))
}

export default async function Pagina() {
  /* Primeira pintura ja sai com a lista certa; o cliente assume depois.
     Se o banco falhar ou demorar, o convite abre do mesmo jeito — data, local
     e WhatsApp nao podem depender da lista. So a lista avisa que nao veio. */
  let reservas: Reservas = {}
  let listaCarregou = true
  try {
    reservas = await comPrazo(listar(), PRAZO_DO_BANCO_MS)
  } catch (erro) {
    console.error('[cha] a pagina abriu sem a lista:', erro)
    listaCarregou = false
  }

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
          <Presentes
            reservasIniciais={reservas}
            modoInicial={modo()}
            listaCarregou={listaCarregou}
          />
          <Divisor className="divisor" />
        </main>
      </div>

      {/* Preso no fundo da janela, atras da cena: aparece quando o palco termina. */}
      <Rodape />
      <Camadas />
    </>
  )
}
