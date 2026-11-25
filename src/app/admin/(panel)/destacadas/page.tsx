import { redirect } from "next/navigation";
import { toggleFeatured } from "@/app/actions/properties";
import { requireSession } from "@/server/session";
import { readStore } from "@/server/store";

export default async function FeaturedPage() {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const store = await readStore();
  const properties = store.properties.filter((property) => property.status === "published");
  return (
    <div>
      <p className="kicker">Portada</p>
      <h1 className="display mt-3 text-4xl text-forest">Destacadas</h1>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {properties.map((property) => (
          <li key={property.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p>{property.title}</p>
              <p className="text-sm text-charcoal/70">{property.featured ? "Destacada" : "En catálogo"}</p>
            </div>
            <form action={toggleFeatured}>
              <input type="hidden" name="id" value={property.id} />
              <button className="btn-line" type="submit">{property.featured ? "Quitar" : "Destacar"}</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
