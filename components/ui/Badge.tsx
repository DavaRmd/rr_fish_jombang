import type { StockStatus, ProductBadge } from '@/types'

type BadgeVariant = 'tersedia' | 'hampir_habis' | 'musim_panen' | 'habis' | 'indent'

interface BadgeProps {
  /** Varian badge — bisa dari status stok atau badge produk */
  variant: BadgeVariant
  /** Override label yang ditampilkan */
  label?: string
  /** Ukuran badge */
  size?: 'sm' | 'md'
  /** Extra className */
  className?: string
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; text: string; defaultLabel: string }> = {
  tersedia: {
    bg: 'bg-brand-light',
    text: 'text-brand-text',
    defaultLabel: 'Tersedia',
  },
  hampir_habis: {
    bg: 'bg-warning-light',
    text: 'text-warning-text',
    defaultLabel: 'Hampir Habis',
  },
  musim_panen: {
    bg: 'bg-brand-light',
    text: 'text-brand-text',
    defaultLabel: 'Musim Panen',
  },
  habis: {
    bg: 'bg-danger-light',
    text: 'text-danger-text',
    defaultLabel: 'Habis',
  },
  indent: {
    bg: 'bg-info-light',
    text: 'text-info-text',
    defaultLabel: 'Indent / Pre-Order',
  },
}

/**
 * Menentukan varian badge berdasarkan status stok dan badge produk.
 * Badge produk (hampir_habis, musim_panen) mengoverride status stok.
 */
export function getBadgeVariant(status: StockStatus, badge?: ProductBadge): BadgeVariant {
  if (badge) return badge
  return status
}

export default function Badge({ variant, label, size = 'md', className = '' }: BadgeProps) {
  const config = BADGE_CONFIG[variant]
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${sizeClasses}
        ${className}
      `}
    >
      {label ?? config.defaultLabel}
    </span>
  )
}
