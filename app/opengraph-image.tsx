import { ImageResponse } from 'next/og'
import { Divisor } from '@/components/Ornamentos'
import { EVENT } from '@/lib/event'

/* Imagem que aparece quando o link é colado no WhatsApp. Gerada no build a
   partir do lib/event.ts: mudou a data lá, a prévia muda junto no próximo deploy. */

export const alt = `Convite do chá de casa nova de ${EVENT.couple.first} e ${EVENT.couple.second}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* As cores da página escritas por extenso: aqui não existe CSS nem variável. */
const COR = {
  papel: '#fbf6ef',
  burgundy: '#4f0c1c',
  wine: '#a11e35',
  olive: '#445230',
  oliveClaro: '#7e8c63',
  tintaFraca: '#7a5f57',
}

type Fonte = { name: string; data: ArrayBuffer; weight: 400; style: 'normal' }

/**
 * Baixa do Google Fonts só as letras que a imagem usa. Se falhar (sem rede no
 * build, por exemplo), devolve null e aquele texto sai na fonte padrão — a
 * prévia perde um pouco de charme, mas o deploy não quebra por causa disso.
 */
async function fonte(familia: string, texto: string): Promise<Fonte | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, '+')}&text=${encodeURIComponent(texto)}`
    const css = await (await fetch(url)).text()
    const arquivo = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
    if (!arquivo) return null
    const resposta = await fetch(arquivo[1])
    if (!resposta.ok) return null
    return { name: familia, data: await resposta.arrayBuffer(), weight: 400, style: 'normal' }
  } catch {
    return null
  }
}

export default async function ImagemDePrevia() {
  const { couple, date, place } = EVENT
  const linha1 = couple.first.toUpperCase()
  const linha2 = `E ${couple.second.toUpperCase()}`
  const titulo = 'Chá de casa nova'
  const quando = `${date.weekday} · ${date.day} de ${date.month} · ${date.time}`.toUpperCase()
  const onde = place.line2

  const fontes = (
    await Promise.all([
      fonte('Italiana', linha1 + linha2),
      fonte('Pinyon Script', titulo),
      fonte('Jost', `CONVITE${quando}${onde}`),
    ])
  ).filter((f): f is Fonte => f !== null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 36,
          background: COR.papel,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(68, 82, 48, 0.35)',
            borderRadius: 4,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Jost',
              fontSize: 22,
              letterSpacing: 9,
              color: COR.oliveClaro,
            }}
          >
            CONVITE
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 22,
              fontFamily: 'Italiana',
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: 6,
              color: COR.burgundy,
            }}
          >
            <span>{linha1}</span>
            <span style={{ marginTop: 8 }}>{linha2}</span>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 14,
              fontFamily: 'Pinyon Script',
              fontSize: 64,
              color: COR.olive,
            }}
          >
            {titulo}
          </div>

          <Divisor cor={COR.olive} acento={COR.wine} style={{ width: 300, height: 86 }} />

          <div
            style={{
              display: 'flex',
              marginTop: 12,
              fontFamily: 'Jost',
              fontSize: 24,
              letterSpacing: 5,
              color: COR.olive,
            }}
          >
            {quando}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 10,
              fontFamily: 'Jost',
              fontSize: 22,
              color: COR.tintaFraca,
            }}
          >
            {onde}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fontes },
  )
}
