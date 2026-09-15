/* Tipos compartilhados entre servidor e navegador.
   Fica separado de `store.ts` para o cliente nunca puxar o driver do Redis. */

/** Uma reserva, do jeito que o navegador ve. O id do convidado nunca vaza. */
export type Publica = { name: string; mine: boolean }

/** Mapa: id do presente -> quem reservou. */
export type Reservas = Record<string, Publica>

/** `memoria` significa que nenhum banco foi configurado. */
export type Modo = 'redis' | 'memoria'
