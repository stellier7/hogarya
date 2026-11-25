import { redirect } from "next/navigation";
import { createAccess, setUserActive } from "@/app/actions/records";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { oneParam } from "@/domain/search";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AccessPage({ searchParams }: Props) {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const notice = oneParam((await searchParams).aviso);
  const store = await readStore();
  return (
    <div className="grid gap-10">
      <div>
        <p className="kicker">Permisos</p>
        <h1 className="display mt-3 text-4xl text-forest">Accesos</h1>
        <p className="mt-3 max-w-xl text-sm leading-6">Las contraseñas no se muestran después de crearlas. Un agente queda limitado a su inmobiliaria y a sus propiedades.</p>
        <div className="mt-4"><AdminNotice code={notice} /></div>
      </div>
      <ul className="grid gap-3 text-sm">
        {store.users.map((account) => (
          <li key={account.id} className="sheet flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <span>{account.name} · {account.email} · {account.role} · {account.active ? "activo" : "suspendido"}</span>
            <form action={setUserActive}>
              <input type="hidden" name="id" value={account.id} />
              <input type="hidden" name="active" value={account.active ? "0" : "1"} />
              <button className="text-xs uppercase tracking-[0.14em]" type="submit">{account.active ? "Suspender" : "Activar"}</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={createAccess} className="grid max-w-xl gap-4">
        <h2 className="display text-3xl text-forest">Nuevo acceso</h2>
        <input name="name" className="field" placeholder="Nombre" required />
        <input name="email" type="email" className="field" placeholder="Correo" required />
        <input name="password" type="password" minLength={10} className="field" placeholder="Contraseña de al menos 10 caracteres" required />
        <select name="role" className="field" defaultValue="agent">
          <option value="admin">Administrador</option>
          <option value="agency">Inmobiliaria</option>
          <option value="agent">Agente</option>
        </select>
        <select name="agencyId" className="field" defaultValue="">
          <option value="">Sin inmobiliaria</option>
          {store.agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.tradeName}</option>)}
        </select>
        <select name="agentId" className="field" defaultValue="">
          <option value="">Sin agente</option>
          {store.agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
        </select>
        <button className="btn w-fit" type="submit">Crear acceso</button>
      </form>
    </div>
  );
}
