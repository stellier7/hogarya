import type { Metadata } from "next";
import { Logo, Mark } from "@/components/logo/Logo";

export const metadata: Metadata = {
  title: "Sistema visual",
  description: "Identidad provisional de Hogar Ya: color, tipografía, logo y piezas de marca sin datos de contacto oficiales.",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Verde bosque", value: "#172B28", text: "text-ivory", bg: "bg-forest" },
  { name: "Dorado champagne", value: "#B89562", text: "text-forest", bg: "bg-gold" },
  { name: "Marfil", value: "#F5F2EB", text: "text-forest", bg: "bg-ivory" },
  { name: "Carbón", value: "#292C2B", text: "text-ivory", bg: "bg-charcoal" },
];

export default function BrandPage() {
  return (
    <article className="mx-auto max-w-6xl px-5 py-16">
      <p className="kicker">Identidad provisional</p>
      <h1 className="display mt-3 text-5xl text-forest">Sistema visual de Hogar Ya</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6">
        El símbolo es un volumen arquitectónico provisional. Cuando exista el SVG oficial, se reemplaza el componente del logo sin cambiar el resto del sitio. No hay teléfono, correo ni usuario de Instagram confirmados.
      </p>

      <section className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
        <div className="border border-line bg-ivory p-8"><Logo /></div>
        <div className="border border-line bg-forest p-8"><Logo tone="ivory" variant="vertical" /></div>
        <div className="grid place-items-center border border-line p-8 text-forest"><Logo variant="mark" /></div>
      </section>

      <section className="mt-14">
        <h2 className="display text-3xl text-forest">Color y tipo</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {colors.map((color) => (
            <div key={color.value} className={`${color.bg} ${color.text} border border-line p-5`}>
              <p className="text-sm">{color.name}</p>
              <p className="mt-6 text-xs tracking-[0.14em]">{color.value}</p>
            </div>
          ))}
        </div>
        <p className="display mt-8 text-5xl text-forest">Playfair Display</p>
        <p className="mt-2 text-sm tracking-[0.14em]">MONTSERRAT PARA INTERFAZ, BOTONES Y NAVEGACIÓN</p>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="display text-3xl text-forest">Publicación</h2>
          <div className="relative mt-4 aspect-square overflow-hidden bg-forest text-ivory">
            <div className="absolute inset-0 bg-[url('/demo/casa-lomas-1.jpg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.18em]">Dato de muestra · En venta</p>
              <p className="display mt-2 text-4xl">L 8,450,000</p>
              <p className="mt-2 text-sm">Tegucigalpa · HY-DEMO-1001</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em]">Hogar Ya</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="display text-3xl text-forest">Historia</h2>
          <div className="relative mx-auto mt-4 aspect-[9/16] max-w-xs overflow-hidden bg-forest text-ivory">
            <div className="absolute inset-0 bg-[url('/demo/hero.jpg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <Mark className="h-8 w-8" />
              <p className="display mt-3 text-3xl">Tu próximo hogar comienza aquí.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="border border-line p-6">
          <p className="kicker">Tarjeta</p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <Logo />
            <p className="text-right text-xs leading-5">Bienes raíces · Honduras<br />Contacto oficial por confirmar</p>
          </div>
        </div>
        <div className="grid place-items-center bg-forest px-6 py-12 text-center text-ivory">
          <p className="text-[0.72rem] uppercase tracking-[0.22em]">Se vende</p>
          <p className="display mt-3 text-4xl">HOGAR YA</p>
          <span className="mt-4 block h-px w-10 bg-gold" />
          <p className="mt-4 text-xs uppercase tracking-[0.16em]">HY-DEMO-1001 · muestra</p>
        </div>
      </section>

      <section className="mt-16 border border-line p-6">
        <h2 className="display text-3xl text-forest">Firma y redes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <Logo />
          <div className="text-sm leading-6">
            <p>Equipo Hogar Ya</p>
            <p>Bienes raíces · Honduras</p>
            <p>Correo oficial por confirmar</p>
          </div>
        </div>
        <div className="mt-8 max-w-xl text-sm leading-6">
          <p className="kicker">Texto sugerido para Instagram</p>
          <p className="mt-3">Hogar Ya | Bienes Raíces Honduras</p>
          <p className="mt-3 whitespace-pre-line">{"Encuentra tu próximo hogar.\nCompra · Vende · Alquila\nPropiedades en toda Honduras\n¿Buscas o quieres publicar? Contáctanos."}</p>
          <p className="mt-4 text-charcoal/70">
            El usuario deseado es @hogarya. No se enlaza: no se confirmó que esté libre, y existen nombres cercanos en otros países. Hay que verificarlo en Instagram antes de usarlo.
          </p>
        </div>
      </section>

      <section className="relative mt-16 min-h-56 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/demo/interior-1.jpg')] bg-cover bg-center" />
        <p className="absolute bottom-4 right-4 text-xs uppercase tracking-[0.2em] text-ivory">Hogar Ya</p>
      </section>
    </article>
  );
}
