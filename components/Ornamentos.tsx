/* Folhagem desenhada em SVG — herda a cor de quem a contem (currentColor). */

type Folha = [x: number, y: number, escala: number, giro: number]

const RAMO: Folha[] = [
  [40, 192, 1.0, -40],
  [74, 186, 0.98, 36],
  [40, 166, 0.94, -36],
  [75, 160, 0.92, 32],
  [43, 141, 0.88, -32],
  [77, 135, 0.86, 30],
  [47, 117, 0.8, -30],
  [79, 111, 0.78, 28],
  [52, 94, 0.72, -28],
  [82, 88, 0.7, 26],
  [58, 72, 0.64, -25],
  [85, 66, 0.62, 23],
  [65, 51, 0.55, -22],
  [87, 45, 0.53, 20],
  [72, 31, 0.45, -18],
  [86, 26, 0.43, 16],
  [78, 14, 0.34, -14],
]

function Folhas({ dados, base = 15 }: { dados: Folha[]; base?: number }) {
  return (
    <>
      {dados.map(([x, y, s, giro], i) => (
        <g key={i} transform={`rotate(${giro} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={base * s} ry={base * 0.64 * s} fill="currentColor" opacity="0.2" />
          <ellipse
            cx={x}
            cy={y}
            rx={base * s}
            ry={base * 0.64 * s}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            opacity="0.55"
          />
          <line
            x1={x - base * 0.9 * s}
            y1={y}
            x2={x + base * 0.85 * s}
            y2={y}
            stroke="currentColor"
            strokeWidth="0.65"
            opacity="0.38"
          />
        </g>
      ))}
    </>
  )
}

/** Ramo de eucalipto para os cantos do convite. */
export function Ramo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true" focusable="false">
      <path
        d="M56 214 C 50 168, 54 122, 64 80 C 70 52, 76 28, 82 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <Folhas dados={RAMO} />
    </svg>
  )
}

const FILETE_ESQ: Folha[] = [
  [133, 34, 1.0, -18],
  [118, 28, 0.85, -27],
  [106, 18, 0.7, -38],
]
const FILETE_DIR: Folha[] = [
  [167, 34, 1.0, 18],
  [182, 28, 0.85, 27],
  [194, 18, 0.7, 38],
]

/** Filete decorativo que separa as secoes. */
export function Filete({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 46" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" opacity="0.5">
        <path d="M0 36 H 88" />
        <path d="M212 36 H 300" />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
        <path d="M150 37 C 136 37, 120 31, 104 16" />
        <path d="M150 37 C 164 37, 180 31, 196 16" />
      </g>
      <Folhas dados={FILETE_ESQ} />
      <Folhas dados={FILETE_DIR} />
      <circle cx="150" cy="37" r="2" fill="currentColor" opacity="0.75" />
    </svg>
  )
}
