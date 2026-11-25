import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteProperty, deletePropertyImage, setPropertyStatus, toggleFeatured, uploadPropertyImage } from "@/app/actions/properties";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { statusLabel } from "@/domain/labels";
import { canDeleteProperty, canManageProperty } from "@/domain/permissions";
import { editorContext } from "@/lib/property-draft";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditPropertyPage({ params, searchParams }: Props) {
  const user = await requireSession();
  const { id } = await params;
  const query = await searchParams;
  const notice = typeof query.aviso === "string" ? query.aviso : undefined;
  const store = await readStore();
  const property = store.properties.find((item) => item.id === id);
  if (!property) notFound();
  if (!canManageProperty(user, property)) redirect("/admin/propiedades?aviso=sin-permiso");
  const { agencies, agents, draft } = await editorContext(user, property);
  const history = store.audit.filter((event) => event.entityId === property.id).slice(0, 8);

  return (
    <div className="grid max-w-5xl gap-10">
      <div>
        <p className="kicker">{property.referenceCode}</p>
        <h1 className="display mt-3 text-4xl text-forest">{property.title}</h1>
        <p className="mt-2 text-sm">{statusLabel(property.status)}{property.rejectionNote ? ` · ${property.rejectionNote}` : ""}</p>
        <AdminNotice code={notice} />
        {property.status === "published" ? <p className="mt-3 text-sm"><Link className="underline" href={`/propiedades/${property.slug}`}>Ver publicación</Link></p> : null}
      </div>
      <PropertyEditor draft={draft} agencies={agencies} agents={agents} canModerate={user.role === "admin"} />
      <section>
        <h2 className="display text-3xl text-forest">Fotografías</h2>
        <ul className="mt-4 grid gap-3">
          {property.images.map((image) => (
            <li key={image.src} className="flex items-center justify-between gap-4 border-t border-line py-3 text-sm">
              <span className="truncate">{image.src}</span>
              <form action={deletePropertyImage}>
                <input type="hidden" name="id" value={property.id} />
                <input type="hidden" name="src" value={image.src} />
                <button className="text-xs uppercase tracking-[0.14em]" type="submit">Quitar</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={uploadPropertyImage} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={property.id} />
          <input name="foto" type="file" accept="image/jpeg,image/png,image/webp" required />
          <button className="btn-line" type="submit">Agregar fotografía</button>
        </form>
      </section>
      {user.role === "admin" ? (
        <section className="grid gap-4">
          <h2 className="display text-3xl text-forest">Revisión</h2>
          <div className="flex flex-wrap gap-3">
            {(["published", "paused", "sold", "rented", "pending", "draft"] as const).map((status) => (
              <form key={status} action={setPropertyStatus}>
                <input type="hidden" name="id" value={property.id} />
                <input type="hidden" name="status" value={status} />
                <button className="btn-line" type="submit">{statusLabel(status)}</button>
              </form>
            ))}
            {property.status === "published" ? (
              <form action={toggleFeatured}>
                <input type="hidden" name="id" value={property.id} />
                <input type="hidden" name="returnTo" value={`/admin/propiedades/${property.id}?aviso=estado`} />
                <button className="btn-line" type="submit">{property.featured ? "Quitar destacada" : "Destacar"}</button>
              </form>
            ) : null}
          </div>
          <form action={setPropertyStatus} className="grid max-w-xl gap-3">
            <input type="hidden" name="id" value={property.id} />
            <input type="hidden" name="status" value="rejected" />
            <label className="grid gap-2 text-sm">
              <span className="kicker">Motivo de rechazo</span>
              <textarea name="note" className="field" rows={3} defaultValue={property.rejectionNote ?? ""} />
            </label>
            <button className="btn w-fit" type="submit">Rechazar</button>
          </form>
        </section>
      ) : null}
      {canDeleteProperty(user, property) ? (
        <form action={deleteProperty}>
          <input type="hidden" name="id" value={property.id} />
          <button className="text-sm underline" type="submit">Eliminar propiedad</button>
        </form>
      ) : null}
      {history.length > 0 ? (
        <section>
          <h2 className="display text-3xl text-forest">Historial</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {history.map((event) => (
              <li key={event.id}>{event.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
