export default function CaraOrderSection() {
  const STEPS = [
    {
      title: 'Pilih Bibit',
      description: 'Cari jenis ikan dan ukuran yang sesuai di katalog kami.',
      number: '1'
    },
    {
      title: 'Isi Formulir',
      description: 'Klik pesan dan lengkapi data pemesanan (nama, kota, jumlah, & pengiriman).',
      number: '2'
    },
    {
      title: 'Konfirmasi WhatsApp',
      description: 'Otomatis diarahkan ke WA untuk pengecekan total harga & stok dengan admin.',
      number: '3'
    },
    {
      title: 'Pengiriman',
      description: 'Bibit siap dikirim ke tujuan dengan aman setelah transaksi disepakati.',
      number: '4'
    }
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cara Memesan</h2>
          <p className="text-gray-600">
            Proses pemesanan mudah dan transparan, sepenuhnya didukung melalui komunikasi personal via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Garis penghubung desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10" />

          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-full bg-brand-light text-brand font-bold text-xl flex items-center justify-center mb-6 ring-8 ring-white group-hover:scale-110 transition-transform shadow-sm">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
