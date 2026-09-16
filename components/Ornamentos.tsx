/* Ornamento em SVG. O verde vem de `currentColor` (quem usa define com `color`);
   o vermelho vem de `--folha-acento`. */

const ACENTO = 'var(--folha-acento)'

type Ponto = [number, number]

/* -------------------------- divisor --------------------------- */

type Curva = [Ponto, Ponto, Ponto, Ponto]

/* So o ramo da esquerda e desenhado; o da direita e o espelho dele.
   O talo nasce a direita do centro e atravessa para a esquerda logo acima
   da base: espelhados, os dois formam o X embaixo, como um ramalhete amarrado. */
const TALO: Curva = [
  [163, 90],
  [134, 70],
  [66, 70],
  [26, 26],
]

function bezier(t: number, [a, b, c, d]: Curva): Ponto {
  const u = 1 - t
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ]
}

/** Angulo (graus) da tangente da curva em t — para a folha nascer alinhada ao talo. */
function inclinacao(t: number, [a, b, c, d]: Curva): number {
  const u = 1 - t
  const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0])
  const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1])
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

const arred = (n: number) => Math.round(n * 100) / 100

/* Folha de oliveira: pontuda nas duas pontas, base na origem, apontando para +x. */
const FOLHA_OLIVEIRA = 'M0 0C4 -3.8 12 -3.8 16 0C12 3.8 4 3.8 0 0Z'

type FolhaDoRamo = { x: number; y: number; giro: number; escala: number }

/* Alternadas dos dois lados, inclinadas para a ponta, afinando no fim.
   Comecam depois do cruzamento para o X ficar limpo. O expoente 0.93 aperta
   um pouco o passo perto da ponta, onde a curva corre ~25% mais rapido. */
const FOLHAS_DO_RAMO: FolhaDoRamo[] = [
  ...Array.from({ length: 10 }, (_, i) => {
    const t = 0.22 + 0.74 * Math.pow(i / 9, 0.93)
    const [x, y] = bezier(t, TALO)
    const lado = i % 2 === 0 ? 1 : -1
    return {
      x: arred(x),
      y: arred(y),
      giro: arred(inclinacao(t, TALO) + lado * 38),
      escala: arred(1 - i * 0.04),
    }
  }),
  { x: 26, y: 26, giro: arred(inclinacao(1, TALO)), escala: 0.58 }, // folha da ponta
]

const caminho = (c: Curva) =>
  `M${c[0].join(' ')} C${c[1].join(' ')}, ${c[2].join(' ')}, ${c[3].join(' ')}`

function RamoDeOliveira() {
  return (
    <>
      <path
        d={caminho(TALO)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {FOLHAS_DO_RAMO.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.giro}) scale(${f.escala})`}>
          <path
            d={FOLHA_OLIVEIRA}
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.05"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M1.5 0H13"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </>
  )
}

/* O detalhe vermelho mora no no: onde os dois ramos se encontram. */
const BAGAS_DO_NO: Array<[number, number, number]> = [
  [150, 68, 2.6],
  [143, 73.5, 2.2],
  [157, 73.5, 2.2],
]

/** Dois ramos de oliveira cruzados — marca a passagem de uma parte do convite para a outra. */
export function Divisor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 10 300 86" className={className} aria-hidden="true" focusable="false">
      <RamoDeOliveira />
      <g transform="translate(300 0) scale(-1 1)">
        <RamoDeOliveira />
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6">
        {BAGAS_DO_NO.map(([x, y], i) => (
          <path key={i} d={`M150 81 Q${x} ${y + 7} ${x} ${y}`} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {BAGAS_DO_NO.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={ACENTO} opacity="0.85" />
      ))}
    </svg>
  )
}
