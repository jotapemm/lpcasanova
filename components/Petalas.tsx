import type { CSSProperties } from "react"

const PETALA = 'M10 27C5 23 1 15 2 9C3 4 7 1 10 3C13 1 18 3 18.5 9C19 16 14 23 10 27Z'

type Petala = {
    y: number
    dur: number
    atraso: number
    tam: number
    giro: number
    tom: 'blush' | 'vinho' | 'folha'
}

const PETALAS: Petala[] = [
    { y: 8, dur: 19, atraso: -3, tam: 15, giro: 3.1, tom: 'blush' },
    { y: 22, dur: 24, atraso: -15, tam: 10, giro: 4.3, tom: 'vinho' },
    { y: 35, dur: 16, atraso: -9, tam: 18, giro: 2.7, tom: 'blush' },
    { y: 48, dur: 21, atraso: -18, tam: 12, giro: 5.3, tom: 'folha' },
    { y: 60, dur: 26, atraso: -6, tam: 9, giro: 3.7, tom: 'vinho' },
    { y: 14, dur: 20, atraso: -12, tam: 13, giro: 4.9, tom: 'blush' },
    { y: 70, dur: 17, atraso: -2, tam: 16, giro: 2.9, tom: 'blush' },
    { y: 42, dur: 22, atraso: -14, tam: 11, giro: 5.9, tom: 'blush' },
    { y: 82, dur: 19, atraso: -10, tam: 14, giro: 3.3, tom: 'folha' },
    { y: 28, dur: 25, atraso: -20, tam: 8, giro: 4.1, tom: 'blush' },
    { y: 26, dur: 20, atraso: -8, tam: 9, giro: 4.5, tom: 'folha' },
    { y: 24, dur: 25, atraso: -14, tam: 13, giro: 4.9, tom: 'blush' },
    { y: 12, dur: 17, atraso: -2, tam: 16, giro: 3.9, tom: 'blush' },
    { y: 15, dur: 20, atraso: -15, tam: 16, giro: 4.1, tom: 'vinho' },
]

export default function Petalas() {
    return (
        <div className="petalas" aria-hidden="true">
            {PETALAS.map((p, i) => (
                <span
                    key={i}
                    className={`petala petala--${p.tom}`}
                    style={{
                        '--y': `${p.y}%`,
                        '--dur': `${p.dur}s`,
                        '--atraso': `${p.atraso}s`,
                        '--tam': `${p.tam}px`,
                        '--giro': `${p.giro}s`,
                    } as CSSProperties}
                >
                    <svg className="petala__forma" viewBox="0 0 20 28">
                        {p.tom === 'folha' ? (
                            <ellipse cx="10" cy="14" rx="7" ry="9" fill="currentColor" />
                        ) : (
                            <path d={PETALA} fill="currentColor" />
                        )}
                    </svg>
                </span>
            ))}
        </div>
    )
}