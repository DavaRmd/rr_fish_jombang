'use client'

import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'whatsapp' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never
  }

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark ' +
    'focus-visible:ring-brand/50',
  outline:
    'border-2 border-brand text-brand hover:bg-brand hover:text-white ' +
    'active:bg-brand-dark active:border-brand-dark focus-visible:ring-brand/50',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#1DA851] active:bg-[#1A9B48] ' +
    'focus-visible:ring-[#25D366]/50',
  danger:
    'bg-danger text-white hover:bg-[#C43C3B] active:bg-[#B03535] ' +
    'focus-visible:ring-danger/50',
  ghost:
    'text-foreground hover:bg-gray-100 active:bg-gray-200 ' +
    'focus-visible:ring-gray-400/50',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center rounded-lg font-semibold',
    'transition-colors duration-150 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'cursor-pointer',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ')

  // Render as <a> if href is provided
  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  // Render as <button>
  const buttonProps = props as ButtonAsButton
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
