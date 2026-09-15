import { NextResponse } from 'next/server'
import { listar, modo } from '@/lib/store'
import { guestId } from '@/lib/valida'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  const g = guestId(new URL(req.url).searchParams.get('g')) ?? ''
  const reservas = await listar(g)
  return NextResponse.json(
    { reservas, modo: modo() },
    { headers: { 'cache-control': 'no-store' } },
  )
}
