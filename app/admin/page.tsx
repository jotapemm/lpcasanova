import type { Metadata } from 'next'
import Admin from '@/components/Admin'

export const metadata: Metadata = {
  title: 'Painel dos noivos',
  /* Fora do Google: ninguém deve achar esta página procurando o convite. */
  robots: { index: false, follow: false },
}

export default function PaginaDoPainel() {
  return <Admin />
}
