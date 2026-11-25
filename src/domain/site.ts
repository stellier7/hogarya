export const siteName = "Hogar Ya";
export const slogan = "Tu próximo hogar comienza aquí.";
export const descriptor = "Bienes raíces · Honduras";
export const description =
  "Marketplace inmobiliario en Honduras para comprar, alquilar y comercializar propiedades con agentes e inmobiliarias autorizadas.";

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/comprar", label: "Comprar" },
  { href: "/alquilar", label: "Alquilar" },
  { href: "/publicar", label: "Publicar propiedad" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function platformWhatsapp(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "").replace(/\D/g, "");
}
