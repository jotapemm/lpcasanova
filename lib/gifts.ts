/* ------------------------------------------------------------------ *
 *  Catalogo de presentes.
 *
 *  O `id` de cada item e a chave usada no banco. Se voce mudar um id
 *  depois que a festa ja comecou, a reserva daquele item se perde.
 *  Para trocar so o texto exibido, mude apenas `name`.
 * ------------------------------------------------------------------ */

export type Gift = { id: string; name: string }
export type Category = { id: string; name: string; items: Gift[] }

const build = (prefix: string, names: string[]): Gift[] =>
  names.map((name, i) => ({ id: `${prefix}-${String(i + 1).padStart(2, '0')}`, name }))

export const CATEGORIES: Category[] = [
  {
    id: 'cozinha',
    name: 'Cozinha',
    items: build('coz', [
      'Liquidificador',
      'Sanduicheira',
      'Panela de pressão (fechamento externo)',
      'Conjunto de xícaras',
      'Batedeira',
      'Descanso de panelas',
      'Conjunto de talheres',
      'Conjunto de pratos',
      'Frigideira',
      'Potes para tempero',
      'Jarra de vidro',
      'Tábua para cortes',
      'Conjunto de sobremesa',
      'Saleiro',
      'Chaleira',
      'Lixeira',
      'Espremedor de laranja',
      'Jogo de copos',
      'Garrafa de café',
      'Formas de bolo',
      'Cuscuzeira',
      'Facas de corte',
      'Porta-frios',
      'Escorredor de macarrão',
      'Potes herméticos',
      'Processador de alimentos',
      'Air fryer',
      'Ventilador',
      'Potes de alimentos (arroz, feijão e açúcar)',
      'Jogo de cabides',
      'Mop giratório',
      'Aspirador de pó',
      'Ferro de passar',
      'Conjunto de panelas',
      'Leiteira',
      'Jogo de taças',
      'Cafeteira elétrica',
      'Jogo de pano de prato',
    ]),
  },
  {
    id: 'banheiro',
    name: 'Banheiro',
    items: build('ban', [
      'Lixeira para banheiro',
      'Conjunto de toalha de rosto',
      'Conjunto de toalha de banho',
      'Jogo de tapetes',
      'Kit de banheiro',
      'Cesto de roupa',
      'Kit sanitário',
    ]),
  },
  {
    id: 'quarto-sala',
    name: 'Quarto e sala',
    items: build('qts', [
      'Jogo de lençol',
      'Edredom de casal',
      'Manta casal',
      'Jogo de almofadas',
    ]),
  },
]

export const ALL_GIFTS: Gift[] = CATEGORIES.flatMap((c) => c.items)
export const TOTAL_GIFTS = ALL_GIFTS.length

export const GIFT_NAME = new Map(ALL_GIFTS.map((g) => [g.id, g.name]))
export const IS_GIFT = (id: unknown): id is string =>
  typeof id === 'string' && GIFT_NAME.has(id)
