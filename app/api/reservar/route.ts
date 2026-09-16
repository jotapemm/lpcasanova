import { NextResponse } from 'next/server'
import { EVENT } from '@/lib/event'
import { GIFT_NAME } from '@/lib/gifts'
import { FORA_DO_AR, listar, modo, reservar } from '@/lib/store'
import { guestId, itens, nomeCompleto } from '@/lib/valida'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const semCache = { headers: { 'cache-control': 'no-store' } }

function lista(ids: string[]) {
  const nomes = ids.map((id) => GIFT_NAME.get(id) ?? id)
  if (nomes.length <= 1) return nomes.join('')
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

export async function POST(req: Request) {
  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ mensagem: 'Pedido inválido.' }, { status: 400, ...semCache })
  }

  const dados = (corpo ?? {}) as Record<string, unknown>
  const g = guestId(dados.guestId)
  if (!g) {
    return NextResponse.json(
      { mensagem: 'Recarregue a página e tente de novo.' },
      { status: 400, ...semCache },
    )
  }

  const nome = nomeCompleto(dados.nome, dados.sobrenome)
  if (!nome.ok) {
    return NextResponse.json({ mensagem: nome.erro }, { status: 400, ...semCache })
  }

  const ids = itens(dados.itens)
  try {
    if (!ids.length) {
      return NextResponse.json(
        { mensagem: 'Escolha pelo menos um presente.', reservas: await listar(g), modo: modo() },
        { status: 400, ...semCache },
      )
    }
    return await responder(g, nome.completo, ids)
  } catch (erro) {
    console.error('[cha] /api/reservar: nao deu pra falar com o banco', erro)
    return NextResponse.json({ mensagem: FORA_DO_AR }, { status: 503, ...semCache })
  }
}

async function responder(g: string, quem: string, ids: string[]) {
  const r = await reservar(g, quem, ids)

  if (!r.ok) {
    const mensagem =
      r.erro === 'limite'
        ? r.restantes === 0
          ? `Você já reservou ${EVENT.maxPicks} presentes. Devolva um para escolher outro.`
          : `Só dá para reservar mais ${r.restantes} ${r.restantes === 1 ? 'presente' : 'presentes'}.`
        : 'Esses presentes já foram reservados. A lista foi atualizada.'
    return NextResponse.json(
      { mensagem, reservas: r.reservas, modo: modo() },
      { status: 409, ...semCache },
    )
  }

  /* Construção impessoal de propósito: a lista mistura gêneros
     (o liquidificador, a cuscuzeira) e concordar item a item daria errado. */
  const aviso = r.perdidos.length
    ? `Alguém já tinha escolhido: ${lista(r.perdidos)}.${r.ganhos.length ? ' O resto está garantido.' : ''}`
    : null

  return NextResponse.json(
    { reservas: r.reservas, ganhos: r.ganhos, perdidos: r.perdidos, aviso, modo: modo() },
    semCache,
  )
}
