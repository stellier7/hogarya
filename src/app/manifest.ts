import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hogar Ya",
    short_name: "Hogar Ya",
    description: "Marketplace inmobiliario en Honduras",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F2EB",
    theme_color: "#172B28",
    lang: "es",
  };
}
