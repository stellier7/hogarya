import { propertyKinds } from "@/domain/labels";
import { zones } from "@/domain/zones";

export function SearchPanel() {
  return (
    <form action="/propiedades" method="get" className="border border-line bg-ivory p-4 shadow-[0_16px_40px_rgb(23_43_40/8%)] md:p-6" role="search" aria-label="Buscar propiedades">
      <div className="grid gap-4 lg:grid-cols-[auto_1fr_1fr_0.7fr_0.7fr_auto] lg:items-end">
        <fieldset className="min-w-44">
          <legend className="kicker mb-2">Operación</legend>
          <div className="operation">
            <label>
              <input type="radio" name="operacion" value="venta" defaultChecked />
              <span>Comprar</span>
            </label>
            <label>
              <input type="radio" name="operacion" value="alquiler" />
              <span>Alquilar</span>
            </label>
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm">
          <span className="kicker">Ubicación</span>
          <select name="ciudad" className="field" defaultValue="">
            <option value="">Todo Honduras</option>
            {zones.map((zone) => (
              <option key={zone.slug} value={zone.slug}>{zone.city}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="kicker">Tipo</span>
          <select name="tipo" className="field" defaultValue="">
            <option value="">Cualquier tipo</option>
            {propertyKinds.map((kind) => (
              <option key={kind.id} value={kind.id}>{kind.singular}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="kicker">Mínimo</span>
          <input name="min" inputMode="numeric" className="field" placeholder="Lempiras" aria-label="Precio mínimo en lempiras" />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="kicker">Máximo</span>
          <input name="max" inputMode="numeric" className="field" placeholder="Lempiras" aria-label="Precio máximo en lempiras" />
        </label>
        <button className="btn w-full" type="submit">Buscar</button>
      </div>
    </form>
  );
}
