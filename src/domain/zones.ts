export type Zone = {
  slug: string;
  city: string;
  department: string;
  image: string;
  summary: string;
};

export const zones: Zone[] = [
  {
    slug: "tegucigalpa",
    city: "Tegucigalpa",
    department: "Francisco Morazán",
    image: "/zones/tegucigalpa.jpg",
    summary: "Capital de Honduras, en el Distrito Central y el departamento de Francisco Morazán.",
  },
  {
    slug: "san-pedro-sula",
    city: "San Pedro Sula",
    department: "Cortés",
    image: "/zones/san-pedro-sula.jpg",
    summary: "Principal ciudad del departamento de Cortés y centro industrial del Valle de Sula.",
  },
  {
    slug: "la-ceiba",
    city: "La Ceiba",
    department: "Atlántida",
    image: "/zones/la-ceiba.jpg",
    summary: "Puerto del departamento de Atlántida, sobre la costa del Caribe.",
  },
  {
    slug: "comayagua",
    city: "Comayagua",
    department: "Comayagua",
    image: "/zones/comayagua.jpg",
    summary: "Ciudad del departamento de Comayagua, en el corredor central del país.",
  },
  {
    slug: "roatan",
    city: "Roatán",
    department: "Islas de la Bahía",
    image: "/zones/roatan.jpg",
    summary: "Isla del departamento de Islas de la Bahía, en el Caribe hondureño.",
  },
  {
    slug: "choluteca",
    city: "Choluteca",
    department: "Choluteca",
    image: "/zones/choluteca.jpg",
    summary: "Cabecera del departamento de Choluteca, en el sur del país.",
  },
  {
    slug: "santa-rosa-de-copan",
    city: "Santa Rosa de Copán",
    department: "Copán",
    image: "/zones/santa-rosa-de-copan.jpg",
    summary: "Cabecera del departamento de Copán, en el occidente de Honduras.",
  },
  {
    slug: "valle-de-angeles",
    city: "Valle de Ángeles",
    department: "Francisco Morazán",
    image: "/zones/valle-de-angeles.jpg",
    summary: "Municipio del departamento de Francisco Morazán, al oriente del Distrito Central.",
  },
];

export function findZone(slug: string | undefined): Zone | undefined {
  if (!slug) return undefined;
  return zones.find((zone) => zone.slug === slug);
}

export function zoneName(slug: string): string {
  return findZone(slug)?.city ?? slug;
}
