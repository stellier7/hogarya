import { redirect } from "next/navigation";
import { setCaptureStatus } from "@/app/actions/records";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { formatDateTime, formatPrice } from "@/domain/format";
import { captureStatusLabel, captureStatuses, kindLabel, operationLabel } from "@/domain/labels";
import { oneParam } from "@/domain/search";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CapturesPage({ searchParams }: Props) {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const notice = oneParam((await searchParams).aviso);
  const store = await readStore();
  return (
    <div>
      <p className="kicker">Captación</p>
      <h1 className="display mt-3 text-4xl text-forest">Solicitudes de propietarios</h1>
      <div className="mt-4"><AdminNotice code={notice} /></div>
      {store.captures.length === 0 ? <p className="mt-6 text-sm">Todavía no hay solicitudes.</p> : null}
      <ul className="mt-6 grid gap-4">
        {store.captures.map((request) => (
          <li key={request.id} className="border border-line p-4 text-sm">
            <p className="text-lg">{request.name}</p>
            <p>{request.email} · {request.phone}</p>
            <p className="mt-2">{request.location} · {kindLabel(request.kind)} · {operationLabel(request.operation)} · {formatPrice(request.estimatedPrice, request.operation)}</p>
            <p className="mt-2">{request.description}</p>
            <p className="mt-2 text-charcoal/70">{formatDateTime(request.createdAt)} · {captureStatusLabel(request.status)}</p>
            {request.photos.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-3">
                {request.photos.map((photo) => (
                  <li key={photo.file}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/capturas/${request.id}/${photo.file}`} alt={photo.name} className="h-24 w-32 object-cover" />
                  </li>
                ))}
              </ul>
            ) : null}
            <form action={setCaptureStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={request.id} />
              <select name="status" className="field" defaultValue={request.status}>
                {captureStatuses.map((status) => <option key={status} value={status}>{captureStatusLabel(status)}</option>)}
              </select>
              <button className="btn" type="submit">Actualizar</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
