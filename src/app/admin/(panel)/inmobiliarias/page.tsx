import { redirect } from "next/navigation";
import { saveAgency } from "@/app/actions/records";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { oneParam } from "@/domain/search";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AgenciesAdminPage({ searchParams }: Props) {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const notice = oneParam((await searchParams).aviso);
  const store = await readStore();
  return (
    <div className="grid gap-10">
      <div>
        <p className="kicker">Socios</p>
        <h1 className="display mt-3 text-4xl text-forest">Inmobiliarias</h1>
        <div className="mt-4"><AdminNotice code={notice} /></div>
      </div>
      <ul className="grid gap-4">
        {store.agencies.map((agency) => (
          <li key={agency.id} className="border border-line p-4 text-sm">
            <p className="text-lg">{agency.tradeName}</p>
            <p className="mt-1">{agency.authorized ? "Autorizada" : "Sin autorización"} · {agency.demo ? "prueba" : "real"}</p>
          </li>
        ))}
      </ul>
      <form action={saveAgency} className="grid max-w-xl gap-4">
        <h2 className="display text-3xl text-forest">Nueva inmobiliaria</h2>
        <input name="tradeName" className="field" placeholder="Nombre comercial" required />
        <input name="location" className="field" placeholder="Ciudad" required />
        <textarea name="description" className="field" rows={4} placeholder="Descripción" required />
        <input name="email" className="field" placeholder="Correo, si ya es oficial" />
        <input name="phone" className="field" placeholder="Teléfono, si ya es oficial" />
        <input name="whatsappE164" className="field" placeholder="WhatsApp en dígitos, si ya es oficial" />
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="authorized" /> Autorizar para publicar</label>
        <button className="btn w-fit" type="submit">Guardar inmobiliaria</button>
      </form>
    </div>
  );
}
