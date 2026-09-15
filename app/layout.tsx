import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Italiana, Jost, Pinyon_Script } from 'next/font/google'
import { COUPLE_LINE, EVENT } from '@/lib/event'
import './globals.css'

const display = Italiana({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
})

const script = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-script',
})

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})

const sans = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const titulo = `Chá de casa nova · ${COUPLE_LINE}`
const descricao = `${EVENT.date.weekday}, ${EVENT.date.day} de ${EVENT.date.month} de ${EVENT.date.year}, às ${EVENT.date.time}. Escolha um presente na lista e confirme sua presença.`

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  openGraph: { title: titulo, description: descricao, type: 'website', locale: 'pt_BR' },
}

export const viewport: Viewport = {
  themeColor: '#360810',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${script.variable} ${serif.variable} ${sans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
