import { NextResponse } from 'next/server'
import { conferirSenha, recusar, semCache } from '@/lib/admin'
import { FORA_DO_AR, listarNoPainel, modo } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Painel dos noivos: todas as reservas, com nome e horario. Exige a senha. */
export async function GET(req: Request) {
  const acesso = conferirSenha(req)
  if (acesso !== 'liberado') return recusar(acesso)

  try {
    const reservas = await listarNoPainel()
    return NextResponse.json({ reservas, modo: modo() }, semCache)
  } catch (erro) {
    console.error('[cha] painel: nao deu pra ler a lista', erro)
    return NextResponse.json({ mensagem: FORA_DO_AR }, { status: 503, ...semCache })
  }
}
