import { setLeadStatus } from "@/app/actions/records";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { formatDateTime } from "@/domain/format";
import { leadStatusLabel, leadStatuses } from "@/domain/labels";
import { leadsFor } from "@/domain/scope";
import { oneParam } from "@/domain/search";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LeadsPage({ searchParams }: Props) {
  const user = await requireSession();
  const notice = oneParam((await searchParams).aviso);
  const store = await readStore();
  const leads = leadsFor(user, store.leads);
  return (
    <div>
      <p className="kicker">Comercial</p>
      <h1 className="display mt-3 text-4xl text-forest">Consultas</h1>
      <div className="mt-4"><AdminNotice code={notice} /></div>
      {leads.length === 0 ? <p className="mt-6 text-sm">Todavía no hay consultas.</p> : null}
      <ul className="mt-6 grid gap-4">
        {leads.map((lead) => {
          const property = store.properties.find((item) => item.id === lead.propertyId);
          return (
            <li key={lead.id} className="border border-line p-4 text-sm">
              <p className="text-lg">{lead.name}</p>
              <p>{lead.email} · {lead.phone}</p>
              <p className="mt-2">{lead.message}</p>
              <p className="mt-2 text-charcoal/70">{formatDateTime(lead.createdAt)} · {property ? property.referenceCode : "Consulta general"} · {leadStatusLabel(lead.status)}</p>
              <form action={setLeadStatus} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <select name="status" className="field" defaultValue={lead.status}>
                  {leadStatuses.map((status) => <option key={status} value={status}>{leadStatusLabel(status)}</option>)}
                </select>
                <button className="btn" type="submit">Actualizar</button>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
