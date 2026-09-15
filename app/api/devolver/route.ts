import { NextResponse } from 'next/server'
import { devolver, modo } from '@/lib/store'
import { guestId, itens } from '@/lib/valida'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const semCache = { headers: { 'cache-control': 'no-store' } }

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

  const ids = itens(dados.itens)
  const reservas = await devolver(g, ids)
  return NextResponse.json({ reservas, modo: modo() }, semCache)
}
