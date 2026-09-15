/* Folhagem em SVG. O verde vem de `currentColor` (cada lugar define o seu
   pela propriedade `color`); o vermelho vem de `--folha-acento`. */

const ACENTO = 'var(--folha-acento)'

/** x, y, escala, giro, 1 = folha no tom vermelho */
type Folha = [number, number, number, number, 1?]
type Ponto = [number, number]

function Folhas({
  dados,
  raio = 16,
  arredondamento = 0.85,
}: {
  dados: Folha[]
  raio?: number
  arredondamento?: number
}) {
  return (
    <>
      {dados.map(([x, y, s, giro, acento], i) => {
        const rx = raio * s
        const ry = raio * arredondamento * s
        const cor = acento ? ACENTO : 'currentColor'
        /* O vermelho precisa de mais corpo que o verde: diluido vira rosa. */
        return (
          <g key={i} transform={`rotate(${giro} ${x} ${y})`}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={cor} opacity={acento ? 0.82 : 0.46} />
            <ellipse
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={cor}
              strokeWidth={1}
              opacity={acento ? 0.95 : 0.8}
            />
            <line
              x1={x - rx * 0.78}
              y1={y}
              x2={x + rx * 0.82}
              y2={y}
              stroke={cor}
              strokeWidth={0.7}
              opacity={acento ? 0.7 : 0.5}
            />
          </g>
        )
      })}
    </>
  )
}

/* ------------------------- eucalipto ------------------------- */

const EUCALIPTO: Folha[] = [
  [38, 198, 1.0, -42],
  [80, 192, 0.98, 38, 1],
  [38, 170, 0.94, -38],
  [82, 164, 0.92, 34],
  [42, 143, 0.88, -34, 1],
  [84, 137, 0.86, 30],
  [47, 117, 0.8, -30],
  [85, 111, 0.78, 26],
  [53, 93, 0.72, -28],
  [86, 87, 0.7, 24, 1],
  [60, 70, 0.62, -25],
  [88, 64, 0.6, 22],
  [67, 49, 0.52, -22],
  [88, 43, 0.5, 20],
  [74, 29, 0.42, -18],
  [80, 12, 0.33, -14],
]

/** Ramo de eucalipto — folha redonda, como no convite de referência. */
export function Ramo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 230" className={className} aria-hidden="true" focusable="false">
      <path
        d="M60 224 C 52 176, 56 126, 68 82 C 74 54, 80 30, 86 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <Folhas dados={EUCALIPTO} />
    </svg>
  )
}

/* ------------------------- samambaia ------------------------- */

const CURVA: Ponto[] = [
  [50, 204],
  [42, 156],
  [54, 94],
  [72, 6],
]

function naCurva(t: number): Ponto {
  const [a, b, c, d] = CURVA
  const u = 1 - t
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ]
}

/* Folíolos gerados sobre a mesma curva do talo, para nada sair do lugar. */
const SAMAMBAIA: Folha[] = Array.from({ length: 12 }, (_, i) => {
  const t = 0.04 + i * 0.081
  const [x, y] = naCurva(t)
  const s = 1 - t * 0.72
  return [
    [x - 11 * s, y - 2, s, -52] as Folha,
    [x + 11 * s, y - 5, s * 0.94, 52] as Folha,
  ]
}).flat()

/** Fronde de samambaia — folíolos estreitos, verde mais vivo. */
export function Samambaia({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 215" className={className} aria-hidden="true" focusable="false">
      <path
        d="M50 204 C 42 156, 54 94, 72 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.65"
      />
      <Folhas dados={SAMAMBAIA} raio={11} arredondamento={0.42} />
    </svg>
  )
}

/* --------------------------- bagas --------------------------- */

const BAGAS: Array<[number, number, number]> = [
  [30, 26, 5.4],
  [49, 16, 4.6],
  [64, 30, 5],
  [22, 47, 4.2],
  [45, 40, 5.6],
  [68, 52, 4.4],
  [34, 63, 4.8],
  [56, 68, 4],
  [45, 86, 3.6],
]

/** Cacho de bagas — o detalhe vermelho solto entre as folhas. */
export function Bagas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 120" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="none" strokeWidth="0.9" strokeLinecap="round" opacity="0.6">
        <path d="M45 118 C 45 104, 44 96, 45 88" />
        {BAGAS.slice(0, 8).map(([x, y], i) => (
          <path key={i} d={`M45 92 C ${(45 + x) / 2} ${(92 + y) / 2 + 6}, ${x} ${y + 14}, ${x} ${y + 6}`} />
        ))}
      </g>
      {BAGAS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={ACENTO} opacity="0.75" />
      ))}
    </svg>
  )
}

/* -------------------------- divisor --------------------------- */

/* Folhas espacadas de proposito: no desenho antigo os raios se somavam
   e o conjunto virava uma mancha em vez de um raminho. */
const DIVISOR_ESQ: Folha[] = [
  [152, 38, 0.9, -14],
  [128, 31, 0.76, -25],
  [106, 19, 0.6, -38],
]
const DIVISOR_DIR: Folha[] = [
  [188, 38, 0.9, 14],
  [212, 31, 0.76, 25],
  [234, 19, 0.6, 38],
]

/** Guirlanda que marca a passagem de uma parte do convite para a outra. */
export function Divisor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 56" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" opacity="0.5">
        <path d="M0 41 H 88" />
        <path d="M252 41 H 340" />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
        <path d="M170 41 C 154 41, 132 36, 108 20" />
        <path d="M170 41 C 186 41, 208 36, 232 20" />
      </g>
      <Folhas dados={DIVISOR_ESQ} raio={14} />
      <Folhas dados={DIVISOR_DIR} raio={14} />
      <circle cx="170" cy="40" r="3.6" fill={ACENTO} opacity="0.85" />
    </svg>
  )
}
