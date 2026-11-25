import type { Metadata } from "next";
import Link from "next/link";
import { CaptureForm } from "@/components/forms/CaptureForm";

export const metadata: Metadata = {
  title: "Publicar propiedad",
  description: "Los propietarios solicitan captación. Solo agentes e inmobiliarias autorizadas publican en Hogar Ya.",
};

export default function PublishPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2">
      <section id="propietarios">
        <p className="kicker">Propietarios</p>
        <h1 className="display mt-3 text-5xl text-forest">Solicite que Hogar Ya comercialice su propiedad</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/80">
          Este formulario no publica el inmueble. Llega al equipo de Hogar Ya para revisión y seguimiento. El nombre, el teléfono y el correo que escriba se guardan como una solicitud.
        </p>
        <div className="mt-8">
          <CaptureForm />
        </div>
      </section>
      <section className="bg-forest px-8 py-10 text-ivory lg:px-10">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ivory/70">Agentes e inmobiliarias</p>
        <h2 className="display mt-3 text-4xl">La publicación directa es para socios autorizados</h2>
        <p className="mt-4 text-sm leading-6 text-ivory/80">
          Cada ficha queda asociada a un agente y pasa por aprobación antes de verse en el catálogo. Un socio no edita el inventario de otra inmobiliaria.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contacto" className="btn bg-ivory text-forest hover:bg-white">Pedir autorización</Link>
          <Link href="/admin/login" className="btn-line border-ivory text-ivory hover:bg-ivory hover:text-forest">Entrar al panel</Link>
        </div>
      </section>
    </div>
  );
}
