import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/galeri',
        '/tentang',
        '/produk/'
      ],
      disallow: [
        '/admin/',
        '/api/'
      ],
    },
    sitemap: 'https://rrfishjombang.com/sitemap.xml',
  }
}
