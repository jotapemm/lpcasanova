'use client'

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FocusEvent,
  PointerEvent,
  ReactNode,
} from 'react'

type Variante = 'solido' | 'wa' | 'fantasma'

type Comum = { variante?: Variante; className?: string; children: ReactNode }

type ComoBotao = Comum &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

type ComoLink = Comum &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

export type BotaoProps = ComoBotao | ComoLink

function classes(variante: Variante = 'solido', extra?: string) {
  return ['botao', variante !== 'solido' && `botao--${variante}`, extra].filter(Boolean).join(' ')
}

/** Grava no elemento de onde a onda nasce e o tamanho que ela precisa ter. */
function ancorar(el: HTMLElement, x: number, y: number) {
  const { width, height } = el.getBoundingClientRect()
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
  /* O raio tem que alcançar o canto mais distante de qualquer origem: a diagonal. */
  el.style.setProperty('--d', `${Math.hypot(width, height) * 2}px`)
}

/* Na entrada a onda nasce no cursor; na saída ela recua na direção dele.
   No scale(1) o círculo cobre o botão todo, então mover o centro ali é invisível. */
function pelaPonta(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  ancorar(e.currentTarget, e.clientX - r.left, e.clientY - r.top)
}

function peloTeclado(e: FocusEvent<HTMLElement>) {
  const el = e.currentTarget
  /* Foco que veio de clique não pode arrancar a onda do cursor para o centro. */
  if (!el.matches(':focus-visible')) return
  const { width, height } = el.getBoundingClientRect()
  ancorar(el, width / 2, height / 2)
}

export default function Botao(props: BotaoProps) {
  if (props.href !== undefined) {
    const { variante, className, children, onPointerEnter, onPointerLeave, onFocus, ...resto } =
      props
    return (
      <a
        {...resto}
        className={classes(variante, className)}
        onPointerEnter={(e) => {
          pelaPonta(e)
          onPointerEnter?.(e)
        }}
        onPointerLeave={(e) => {
          pelaPonta(e)
          onPointerLeave?.(e)
        }}
        onFocus={(e) => {
          peloTeclado(e)
          onFocus?.(e)
        }}
      >
        {children}
      </a>
    )
  }

  const {
    variante,
    className,
    children,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    type = 'button',
    ...resto
  } = props

  return (
    <button
      {...resto}
      type={type}
      className={classes(variante, className)}
      onPointerEnter={(e) => {
        pelaPonta(e)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        pelaPonta(e)
        onPointerLeave?.(e)
      }}
      onFocus={(e) => {
        peloTeclado(e)
        onFocus?.(e)
      }}
    >
      {children}
    </button>
  )
}
