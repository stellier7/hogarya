import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { editorContext } from "@/lib/property-draft";
import { requireSession } from "@/server/session";

export default async function NewPropertyPage() {
  const user = await requireSession();
  const { agencies, agents, draft } = await editorContext(user);
  return (
    <div className="max-w-3xl">
      <p className="kicker">Nueva</p>
      <h1 className="display mt-3 text-4xl text-forest">Crear propiedad</h1>
      <p className="mt-3 text-sm leading-6">Si no está activo el modo de inventario real, la ficha se guarda como prueba y no entra al sitemap.</p>
      {agencies.length === 0 || agents.length === 0 ? (
        <p className="mt-6 text-sm">No hay una inmobiliaria y un agente disponibles para su usuario.</p>
      ) : (
        <div className="mt-8">
          <PropertyEditor draft={draft} agencies={agencies} agents={agents} canModerate={user.role === "admin"} />
        </div>
      )}
    </div>
  );
}
