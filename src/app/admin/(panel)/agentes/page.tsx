import { redirect } from "next/navigation";
import { saveAgent } from "@/app/actions/records";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { agenciesFor } from "@/domain/scope";
import { oneParam } from "@/domain/search";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AgentsAdminPage({ searchParams }: Props) {
  const user = await requireSession();
  if (user.role === "agent") redirect("/admin");
  const notice = oneParam((await searchParams).aviso);
  const store = await readStore();
  const agencies = agenciesFor(user, store.agencies);
  const agents = store.agents.filter((agent) => user.role === "admin" || agent.agencyId === user.agencyId);
  return (
    <div className="grid gap-10">
      <div>
        <p className="kicker">Equipo</p>
        <h1 className="display mt-3 text-4xl text-forest">Agentes</h1>
        <div className="mt-4"><AdminNotice code={notice} /></div>
      </div>
      <ul className="grid gap-3">
        {agents.map((agent) => (
          <li key={agent.id} className="sheet px-4 py-3 text-sm">
            <p>{agent.name}</p>
            <p className="text-charcoal/70">{store.agencies.find((agency) => agency.id === agent.agencyId)?.tradeName} · {agent.authorized ? "autorizado" : "sin autorización"}</p>
          </li>
        ))}
      </ul>
      <form action={saveAgent} className="grid max-w-xl gap-4">
        <h2 className="display text-3xl text-forest">Nuevo agente</h2>
        <input name="name" className="field" placeholder="Nombre" required />
        <textarea name="bio" className="field" rows={4} placeholder="Descripción" required />
        <input name="location" className="field" placeholder="Ciudad" />
        {user.role === "admin" ? (
          <select name="agencyId" className="field" defaultValue={agencies[0]?.id}>
            {agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.tradeName}</option>)}
          </select>
        ) : null}
        <input name="email" className="field" placeholder="Correo, si ya es oficial" />
        <input name="phone" className="field" placeholder="Teléfono, si ya es oficial" />
        <input name="whatsappE164" className="field" placeholder="WhatsApp en dígitos, si ya es oficial" />
        {user.role === "admin" ? <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="authorized" /> Autorizar</label> : null}
        <button className="btn w-fit" type="submit">Guardar agente</button>
      </form>
    </div>
  );
}
