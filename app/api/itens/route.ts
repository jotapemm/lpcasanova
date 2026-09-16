import { NextResponse } from 'next/server'
import { FORA_DO_AR, listar, modo } from '@/lib/store'
import { guestId } from '@/lib/valida'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const semCache = { headers: { 'cache-control': 'no-store' } }

export async function GET(req: Request) {
  const g = guestId(new URL(req.url).searchParams.get('g')) ?? ''
  try {
    const reservas = await listar(g)
    return NextResponse.json({ reservas, modo: modo() }, semCache)
  } catch (erro) {
    console.error('[cha] /api/itens: nao deu pra ler a lista', erro)
    return NextResponse.json({ mensagem: FORA_DO_AR }, { status: 503, ...semCache })
  }
}
