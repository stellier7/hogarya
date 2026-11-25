import { redirect } from "next/navigation";
import { formatDateTime } from "@/domain/format";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

export default async function ActivityPage() {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const store = await readStore();
  return (
    <div>
      <p className="kicker">Registro</p>
      <h1 className="display mt-3 text-4xl text-forest">Actividad</h1>
      <ul className="mt-8 grid gap-3 text-sm">
        {store.audit.map((event) => (
          <li key={event.id} className="border-t border-line py-3">
            <p>{event.summary}</p>
            <p className="text-charcoal/70">{formatDateTime(event.at)} · {event.actor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
