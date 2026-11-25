import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escriba a Hogar Ya para buscar una propiedad, comercializar un inmueble o solicitar autorización como socio.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <p className="kicker">Contacto</p>
        <h1 className="display mt-3 text-5xl text-forest">Escríbanos</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/80">
          Use este formulario para una consulta general o para pedir autorización como agente o inmobiliaria. No publicamos un teléfono, un correo ni una dirección hasta que sean oficiales.
        </p>
        <p className="mt-6 text-sm leading-6">
          WhatsApp del marketplace aparece en las fichas solo cuando hay un número configurado en el servidor. Los agentes de prueba no tienen número.
        </p>
      </div>
      <InquiryForm source="partner" submitLabel="Enviar mensaje" />
    </div>
  );
}
