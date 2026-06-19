/**
 * Format angka ke format mata uang Rupiah (IDR).
 * Contoh: formatRupiah(200) → "Rp200"
 * Contoh: formatRupiah(1500) → "Rp1.500"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format range harga untuk ditampilkan.
 * Contoh: formatPriceRange(200, 300) → "Rp200 – Rp300"
 * Contoh: formatPriceRange(200, 200) → "Rp200"
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatRupiah(min)
  return `${formatRupiah(min)} – ${formatRupiah(max)}`
}

/**
 * Format tanggal ke format Indonesia yang mudah dibaca.
 * Contoh: formatDate("2024-03-15T10:30:00Z") → "15 Maret 2024"
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Format tanggal dengan waktu.
 * Contoh: formatDateTime("2024-03-15T10:30:00Z") → "15 Maret 2024, 17:30 WIB"
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short',
  }).format(new Date(dateString))
}

/**
 * Format angka ke format Indonesia.
 * Contoh: formatNumber(1500) → "1.500"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}
