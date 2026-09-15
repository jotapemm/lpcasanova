/* ------------------------------------------------------------------ *
 *  EDITE AQUI — tudo que muda de festa para festa esta neste arquivo.
 * ------------------------------------------------------------------ */

export const EVENT = {
  /** Nomes do casal, como aparecem no convite (vao para maiusculas sozinhos). */
  couple: {
    first: 'João Pedro',
    second: 'Amanda',
  },

  /** >>> TROQUE PELA DATA REAL <<< */
  date: {
    month: 'Outubro',
    weekday: 'Sábado',
    day: '17',
    year: '2026',
    time: '16 horas',
  },

  /** >>> TROQUE PELO ENDERECO REAL <<<
   *  Deixe `mapsUrl` vazio que o link do mapa sai do proprio endereco.
   *  So preencha se quiser apontar para um ponto especifico do Google Maps. */
  place: {
    line1: 'Rua do evento, 99',
    line2: 'Vila A — Foz do Iguaçu/PR',
    mapsUrl: '',
  },

  /** >>> TROQUE PELO SEU WHATSAPP <<< formato: 55 + DDD + numero, so digitos. */
  whatsapp: {
    number: '5545999614413',
    label: '(45) 99961-4413',
  },

  /** Quantos presentes cada convidado pode reservar. */
  maxPicks: 3,
} as const

export const COUPLE_LINE = `${EVENT.couple.first} & ${EVENT.couple.second}`

/** Usa o `mapsUrl` se houver; senao monta a busca com o endereco escrito acima. */
export const mapaLink: string =
  EVENT.place.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${EVENT.place.line1}, ${EVENT.place.line2}`,
  )}`

export function whatsappLink(items: string[] = []) {
  const lista = items.length ? ` Vou levar: ${items.join(', ')}.` : ''
  const texto = `Oi! Confirmo presença no chá de casa nova do ${EVENT.couple.first} e da ${EVENT.couple.second}.${lista}`
  return `https://wa.me/${EVENT.whatsapp.number}?text=${encodeURIComponent(texto)}`
}
