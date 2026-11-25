"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="display text-4xl text-forest">No pudimos abrir esta página</h1>
      <button type="button" className="btn mt-8" onClick={reset}>Reintentar</button>
    </div>
  );
}
