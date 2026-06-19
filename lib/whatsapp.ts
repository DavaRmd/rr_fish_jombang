interface OrderData {
  customerName: string
  customerCity: string
  productName: string
  quantityRange: string
  shippingMethod: string
  notes?: string
}

const SHIPPING_LABELS: Record<string, string> = {
  ambil_sendiri:        'Ambil sendiri',
  ekspedisi_jawa:       'Ekspedisi / cargo (Jawa)',
  ekspedisi_kalimantan: 'Ekspedisi / cargo (Kalimantan)',
  kurir_lokal:          'Kurir / kendaraan lokal',
}

export function generateWAMessage(data: OrderData, waNumber: string): string {
  const shipping = SHIPPING_LABELS[data.shippingMethod] ?? data.shippingMethod
  const notes    = data.notes ? `\nCatatan: ${data.notes}` : ''

  const message =
    `Halo, saya ${data.customerName} dari ${data.customerCity}. ` +
    `Saya tertarik memesan ${data.productName} sebanyak ${data.quantityRange} ekor ` +
    `dengan metode pengiriman ${shipping}.${notes} ` +
    `Mohon info harga dan ketersediaan stoknya. 🙏`

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${waNumber}?text=${encoded}`
}
