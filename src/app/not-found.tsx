import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <p className="kicker">404</p>
      <h1 className="enter display mt-3 text-5xl text-forest">No encontramos esta página</h1>
      <p className="mt-4 text-sm leading-6">La dirección no corresponde a una sección de Hogar Ya.</p>
      <Link href="/" className="btn mt-8">Volver al inicio</Link>
    </div>
  );
}
