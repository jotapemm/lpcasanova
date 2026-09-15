import { Redis } from '@upstash/redis'
import { EVENT } from './event'
import { IS_GIFT } from './gifts'
import type { Modo, Reservas } from './tipos'

export type { Modo, Publica, Reservas } from './tipos'

/**
 * Uma reserva: quem pegou (`g` = id anonimo do navegador), o nome que o
 * convidado digitou (`n`) e quando (`t`).
 */
export type Reserva = { g: string; n: string; t: number }

const KEY = process.env.RESERVAS_KEY || 'cha:jpa:reservas'

/* -------------------------------------------------------------- */

let cliente: Redis | null | undefined
/** Fallback para `npm run dev` sem banco. Some a cada reinicio. */
const memoria = new Map<string, Reserva>()

/** Terminacoes que a Vercel e a Upstash usam para a URL REST. */
const SUFIXOS = ['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL', 'REDIS_REST_URL']

/**
 * Acha a dupla url/token sem depender do nome exato da variavel: quando a
 * store tem nome proprio, a Vercel injeta tudo com prefixo (por exemplo
 * `LPCASANOVA_KV_REST_API_URL`). Procuramos primeiro os nomes secos e depois
 * qualquer variante que termine num dos sufixos conhecidos.
 */
function credenciais(): { url: string; token: string; via: string } | null {
  const env = process.env
  const candidatas = [
    ...SUFIXOS.filter((s) => env[s]),
    ...Object.keys(env).filter(
      (k) => !SUFIXOS.includes(k) && SUFIXOS.some((s) => k.endsWith(s)),
    ),
  ]

  for (const chave of candidatas) {
    const url = env[chave]
    if (!url || !/^https?:\/\//.test(url)) continue
    const token = env[chave.replace(/_URL$/, '_TOKEN')]
    if (token) return { url, token, via: chave }
  }
  return null
}

function redis(): Redis | null {
  if (cliente !== undefined) return cliente

  const cred = credenciais()
  cliente = cred ? new Redis({ url: cred.url, token: cred.token }) : null

  if (cred) {
    console.log(`[cha] Redis conectado via ${cred.via}`)
  } else {
    /* So os NOMES das variaveis, nunca os valores — isto vai para o log. */
    const parecidas = Object.keys(process.env).filter((k) =>
      /REDIS|UPSTASH|^KV_/.test(k),
    )
    console.warn(
      '[cha] Nenhum Redis configurado — rodando em memoria, as reservas NAO sao salvas. ' +
        `Variaveis parecidas encontradas: ${parecidas.join(', ') || '(nenhuma)'}`,
    )
  }
  return cliente
}

export function modo(): Modo {
  return redis() ? 'redis' : 'memoria'
}

/** O Upstash as vezes devolve JSON ja convertido em objeto, as vezes string. */
function decode(v: unknown): Reserva | null {
  let o: unknown = v
  if (typeof o === 'string') {
    try {
      o = JSON.parse(o)
    } catch {
      return null
    }
  }
  if (!o || typeof o !== 'object') return null
  const { g, n, t } = o as Record<string, unknown>
  if (typeof g !== 'string' || typeof n !== 'string') return null
  return { g, n, t: typeof t === 'number' ? t : 0 }
}

async function lerTudo(): Promise<Map<string, Reserva>> {
  const r = redis()
  if (!r) return new Map(memoria)

  const bruto = await r.hgetall<Record<string, unknown>>(KEY)
  const saida = new Map<string, Reserva>()
  if (!bruto) return saida
  for (const [id, valor] of Object.entries(bruto)) {
    if (!IS_GIFT(id)) continue
    const reserva = decode(valor)
    if (reserva) saida.set(id, reserva)
  }
  return saida
}

function publicar(mapa: Map<string, Reserva>, guestId: string): Reservas {
  const saida: Reservas = {}
  for (const [id, r] of mapa) saida[id] = { name: r.n, mine: r.g === guestId }
  return saida
}

/* ------------------------------ leitura ------------------------------ */

export async function listar(guestId = ''): Promise<Reservas> {
  return publicar(await lerTudo(), guestId)
}

/* ------------------------------ escrita ------------------------------ */

export type ResultadoReserva =
  | { ok: true; reservas: Reservas; ganhos: string[]; perdidos: string[] }
  | { ok: false; erro: 'limite' | 'vazio'; reservas: Reservas; restantes: number }

/**
 * Reserva itens de forma atomica.
 *
 * `HSETNX` so grava se o campo ainda nao existir e devolve 1/0 — e a
 * garantia de que dois convidados clicando ao mesmo tempo no mesmo
 * presente nao levam os dois. Quem perder a corrida recebe o item em
 * `perdidos` e mantem os outros.
 */
export async function reservar(
  guestId: string,
  nome: string,
  itens: string[],
): Promise<ResultadoReserva> {
  const atual = await lerTudo()

  const meus = [...atual].filter(([, r]) => r.g === guestId).map(([id]) => id)
  const desejados = itens.filter((id) => !atual.has(id))
  const restantes = Math.max(0, EVENT.maxPicks - meus.length)

  if (!desejados.length) {
    return { ok: false, erro: 'vazio', reservas: publicar(atual, guestId), restantes }
  }
  if (desejados.length > restantes) {
    return { ok: false, erro: 'limite', reservas: publicar(atual, guestId), restantes }
  }

  const r = redis()
  const ganhos: string[] = []
  const perdidos: string[] = []

  for (const id of desejados) {
    const reserva: Reserva = { g: guestId, n: nome, t: Date.now() }
    let venceu: boolean
    if (r) {
      venceu = (await r.hsetnx(KEY, id, JSON.stringify(reserva))) === 1
    } else if (memoria.has(id)) {
      venceu = false
    } else {
      memoria.set(id, reserva)
      venceu = true
    }
    ;(venceu ? ganhos : perdidos).push(id)
  }

  return { ok: true, reservas: await listar(guestId), ganhos, perdidos }
}

/** So o dono consegue devolver um presente para a lista. */
export async function devolver(guestId: string, itens: string[]): Promise<Reservas> {
  const atual = await lerTudo()
  const meus = itens.filter((id) => atual.get(id)?.g === guestId)
  if (!meus.length) return publicar(atual, guestId)

  const r = redis()
  if (r) await r.hdel(KEY, ...meus)
  else meus.forEach((id) => memoria.delete(id))

  return listar(guestId)
}
