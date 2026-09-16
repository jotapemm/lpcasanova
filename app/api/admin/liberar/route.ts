import { NextResponse } from 'next/server'
import { conferirSenha, recusar, semCache } from '@/lib/admin'
import { FORA_DO_AR, liberarNoPainel, listarNoPainel } from '@/lib/store'
import { itens } from '@/lib/valida'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Devolve presentes pra lista sem precisar ser quem reservou. Exige a senha. */
export async function POST(req: Request) {
  const acesso = conferirSenha(req)
  if (acesso !== 'liberado') return recusar(acesso)

  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ mensagem: 'Pedido inválido.' }, { status: 400, ...semCache })
  }

  const ids = itens((corpo as Record<string, unknown> | null)?.itens)
  if (!ids.length) {
    return NextResponse.json({ mensagem: 'Nenhum presente válido.' }, { status: 400, ...semCache })
  }

  try {
    await liberarNoPainel(ids)
    return NextResponse.json({ reservas: await listarNoPainel() }, semCache)
  } catch (erro) {
    console.error('[cha] painel: nao deu pra liberar', erro)
    return NextResponse.json({ mensagem: FORA_DO_AR }, { status: 503, ...semCache })
  }
}
