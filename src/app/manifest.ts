import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "SAWIRI", short_name: "SAWIRI", description: "Architectural project studies, studio notes, and project inquiries.", start_url: "/", display: "standalone", background_color: "#f1f0eb", theme_color: "#171817" };
}
