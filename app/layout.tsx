import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://rrfishjombang.com'),
  title: {
    default: "RR Fish Jombang — Bibit Ikan Segar, Berkualitas & Terpercaya",
    template: "%s | RR Fish Jombang",
  },
  description:
    "Jual bibit ikan air tawar berkualitas: Gurame, Patin, Lele, Nila. " +
    "Melayani pengiriman ke seluruh Jawa & Kalimantan. " +
    "10+ kolam pembibitan aktif di Jombang, Jawa Timur.",
  keywords: [
    "bibit ikan",
    "bibit gurame",
    "bibit patin",
    "bibit lele",
    "bibit nila",
    "ikan air tawar",
    "jual bibit ikan",
    "RR Fish Jombang",
    "bibit ikan Jombang",
    "bibit ikan Jawa Timur",
  ],
  authors: [{ name: "RR Fish Jombang" }],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "RR Fish Jombang",
      title: "RR Fish Jombang — Bibit Ikan Segar, Berkualitas & Terpercaya",
      description:
        "Jual bibit ikan air tawar berkualitas: Gurame, Patin, Lele, Nila. " +
        "Melayani pengiriman ke seluruh Jawa & Kalimantan.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "RR Fish Jombang — Bibit Ikan Air Tawar Berkualitas",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "RR Fish Jombang — Bibit Ikan Segar, Berkualitas & Terpercaya",
      description:
        "Jual bibit ikan air tawar berkualitas: Gurame, Patin, Lele, Nila. " +
        "Melayani pengiriman ke seluruh Jawa & Kalimantan.",
      images: ["/og-image.png"],
    },
  };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1D9E75",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  (event.reason.message && event.reason.message.indexOf('MetaMask') !== -1) ||
                  (event.reason.stack && event.reason.stack.indexOf('chrome-extension') !== -1) ||
                  String(event.reason).indexOf('MetaMask') !== -1
                )) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              });
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
