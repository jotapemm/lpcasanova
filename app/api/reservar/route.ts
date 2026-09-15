import { NextResponse } from 'next/server'
import { EVENT } from '@/lib/event'
import { GIFT_NAME } from '@/lib/gifts'
import { listar, modo, reservar } from '@/lib/store'
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
  if (!ids.length) {
    return NextResponse.json(
      { mensagem: 'Escolha pelo menos um presente.', reservas: await listar(g), modo: modo() },
      { status: 400, ...semCache },
    )
  }

  const r = await reservar(g, nome.completo, ids)

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

  const aviso = r.perdidos.length
    ? r.ganhos.length
      ? `${lista(r.perdidos)} ${r.perdidos.length === 1 ? 'acabou' : 'acabaram'} de ser reservado${r.perdidos.length === 1 ? '' : 's'} por outra pessoa. O resto está garantido.`
      : `${lista(r.perdidos)} ${r.perdidos.length === 1 ? 'acabou' : 'acabaram'} de ser reservado${r.perdidos.length === 1 ? '' : 's'} por outra pessoa.`
    : null

  return NextResponse.json(
    { reservas: r.reservas, ganhos: r.ganhos, perdidos: r.perdidos, aviso, modo: modo() },
    semCache,
  )
}
