import Link from "next/link";
import { leadsFor, propertiesFor } from "@/domain/scope";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

export default async function AdminHome() {
  const user = await requireSession();
  const store = await readStore();
  const properties = propertiesFor(user, store.properties);
  const leads = leadsFor(user, store.leads);
  const cards = [
    ["Publicadas", properties.filter((property) => property.status === "published").length, "/admin/propiedades"],
    ["Pendientes", properties.filter((property) => property.status === "pending").length, "/admin/propiedades"],
    ["Consultas nuevas", leads.filter((lead) => lead.status === "new").length, "/admin/consultas"],
  ];
  if (user.role === "admin") {
    cards.push(["Captaciones nuevas", store.captures.filter((item) => item.status === "received").length, "/admin/captaciones"]);
  }
  return (
    <div>
      <p className="kicker">Resumen</p>
      <h1 className="display mt-3 text-4xl text-forest">Hola, {user.name}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6">Las fichas de demostración siguen marcadas como prueba y no se indexan. Un agente solo ve su inventario.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, href]) => (
          <Link key={String(label)} href={String(href)} className="border border-line bg-white p-5">
            <p className="kicker">{label}</p>
            <p className="display mt-3 text-4xl text-forest">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
