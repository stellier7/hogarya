import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { description, siteName, siteUrl, slogan } from "@/domain/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${siteName} — Bienes raíces en Honduras`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "es_HN",
    siteName,
    title: `${siteName} — ${slogan}`,
    description,
    images: [{ url: "/demo/hero.jpg", alt: "Fotografía de referencia de una casa. No es un inmueble de Hogar Ya." }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#172B28",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${playfair.variable} ${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
