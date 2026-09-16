import { createHash, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

/* Senha curta cai num chute automatizado em minutos. */
const TAMANHO_MINIMO = 12

export const semCache = { headers: { 'cache-control': 'no-store' } }

export type Acesso = 'liberado' | 'senha-errada' | 'sem-senha' | 'senha-fraca'

const resumo = (texto: string) => createHash('sha256').update(texto).digest()

/**
 * Confere o cabecalho `x-senha` contra a variavel ADMIN_SENHA.
 *
 * Compara os hashes em tempo constante: quem tenta adivinhar nao consegue
 * medir pelo tempo de resposta quantas letras acertou.
 */
export function conferirSenha(req: Request): Acesso {
  const esperada = process.env.ADMIN_SENHA
  if (!esperada) return 'sem-senha'
  if (esperada.length < TAMANHO_MINIMO) return 'senha-fraca'
  const enviada = req.headers.get('x-senha') ?? ''
  return timingSafeEqual(resumo(enviada), resumo(esperada)) ? 'liberado' : 'senha-errada'
}

const espera = (ms: number) => new Promise((fim) => setTimeout(fim, ms))

export async function recusar(acesso: Exclude<Acesso, 'liberado'>) {
  if (acesso === 'sem-senha') {
    return NextResponse.json(
      { mensagem: 'O painel está desligado: falta criar a variável ADMIN_SENHA na Vercel.' },
      { status: 503, ...semCache },
    )
  }
  if (acesso === 'senha-fraca') {
    return NextResponse.json(
      {
        mensagem: `O painel está desligado: a ADMIN_SENHA precisa ter pelo menos ${TAMANHO_MINIMO} caracteres.`,
      },
      { status: 503, ...semCache },
    )
  }
  /* Cada chute errado custa quase um segundo: adivinhar no automatico fica inviavel. */
  await espera(800)
  return NextResponse.json({ mensagem: 'Senha incorreta.' }, { status: 401, ...semCache })
}
