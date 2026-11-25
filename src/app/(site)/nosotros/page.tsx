import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Hogar Ya es un marketplace inmobiliario nacional en Honduras. No sustituye la marca de cada inmobiliaria autorizada.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="kicker">Nosotros</p>
      <h1 className="enter display mt-3 text-5xl text-forest">Una plataforma, varias inmobiliarias</h1>
      <div className="mt-8 grid gap-5 text-sm leading-7">
        <p>
          Hogar Ya conecta a quien busca comprar o alquilar en Honduras con el agente autorizado que comercializa cada propiedad. También recibe solicitudes de propietarios que quieren que su inmueble se comercialice, sin abrir la publicación al público general.
        </p>
        <p>
          La marca busca elegancia, confianza y claridad. El verde bosque ordena la experiencia, el dorado señala lo importante y el marfil deja espacio a las fotografías. No es un tablero de clasificados ni el sitio de una sola agencia.
        </p>
        <p>
          Diversa y Altair Real Estate son referencias de cómo trabaja una inmobiliaria con su propio nombre, su inventario y su relación con el cliente. Esas marcas no se mezclan con Hogar Ya. Cuando un socio entra a la plataforma, aparece con su identidad en las fichas que le corresponden.
        </p>
        <p>
          Todavía no hay teléfono, correo, dirección ni redes oficiales de Hogar Ya. Esos datos se agregarán cuando la empresa los confirme. Cada ficha publica el contacto de quien la comercializa.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/propiedades" className="btn">Ver propiedades</Link>
        <Link href="/contacto" className="btn-line">Contacto</Link>
      </div>
    </article>
  );
}
