import Link from "next/link";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { formatPrice } from "@/domain/format";
import { publicationStatuses, statusLabel } from "@/domain/labels";
import { propertiesFor } from "@/domain/scope";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const user = await requireSession();
  const params = await searchParams;
  const status = typeof params.estado === "string" ? params.estado : "";
  const notice = typeof params.aviso === "string" ? params.aviso : undefined;
  const store = await readStore();
  const agencies = new Map(store.agencies.map((agency) => [agency.id, agency.tradeName]));
  const properties = propertiesFor(user, store.properties).filter((property) => !status || property.status === status);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Inventario</p>
          <h1 className="display mt-3 text-4xl text-forest">Propiedades</h1>
        </div>
        <Link href="/admin/propiedades/nueva" className="btn">Nueva propiedad</Link>
      </div>
      <div className="mt-6"><AdminNotice code={notice} /></div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em]">
        <Link className="chip" href="/admin/propiedades" aria-current={status ? undefined : "page"}>Todas</Link>
        {publicationStatuses.map((item) => (
          <Link key={item} className="chip" href={`/admin/propiedades?estado=${item}`} aria-current={status === item ? "page" : undefined}>{statusLabel(item)}</Link>
        ))}
      </div>
      <ul className="sheet mt-6 divide-y divide-line overflow-hidden px-4">
        {properties.map((property) => (
          <li key={property.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <Link href={`/admin/propiedades/${property.id}`} className="text-lg">{property.title}</Link>
              <p className="text-sm text-charcoal/70">{property.referenceCode} · {property.city} · {agencies.get(property.agencyId)}</p>
            </div>
            <p className="text-sm">{formatPrice(property.price, property.operation, property.currency)}</p>
            <p className="text-xs uppercase tracking-[0.14em]">{statusLabel(property.status)}{property.demo ? " · prueba" : ""}</p>
          </li>
        ))}
      </ul>
      {properties.length === 0 ? <p className="mt-6 text-sm">No hay propiedades en esta vista.</p> : null}
    </div>
  );
}
