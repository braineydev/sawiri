import type { Project } from "@/types/project";

const image = (id: string, width = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

export const demoProjects: Project[] = [
  {
    id: "demo-01", slug: "courtyard-house", title: "Courtyard House", location: "Nairobi, Kenya",
    coordinates: { lat: -1.2864, lng: 36.8172 }, year: 2025, area_sqm: 286, typology: "Residential", status: "Concept",
    hero_image_url: image("photo-1600210492486-724fe5c67fb0"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1600210492486-724fe5c67fb0"), alt: "Quiet contemporary living space opening to a garden" }], blueprint_urls: [],
    architectural_narrative: "A sequence of shaded thresholds gathers daily life around a planted, open-air room.", featured: true, display_order: 1, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-02", slug: "stone-and-light", title: "Stone & Light", location: "Naivasha, Kenya",
    coordinates: { lat: -0.7167, lng: 36.431 }, year: 2024, area_sqm: 412, typology: "Residential", status: "In Progress",
    hero_image_url: image("photo-1600607687939-ce8a6c25118c"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1600607687939-ce8a6c25118c"), alt: "Sculptural modern home in warm natural light" }], blueprint_urls: [],
    architectural_narrative: "A low, grounded retreat frames long views across the rift valley landscape.", featured: true, display_order: 2, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-03", slug: "civic-room", title: "Civic Room", location: "Mombasa, Kenya",
    coordinates: { lat: -4.0435, lng: 39.6682 }, year: 2023, area_sqm: 1250, typology: "Cultural", status: "Concept",
    hero_image_url: image("photo-1511818966892-d7d671e672a2"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1511818966892-d7d671e672a2"), alt: "Modern public architecture with geometric forms" }], blueprint_urls: [],
    architectural_narrative: "A civic canopy creates a generous public threshold between street and courtyard.", featured: true, display_order: 3, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-04", slug: "form-and-field", title: "Form & Field", location: "Nakuru, Kenya",
    coordinates: { lat: -0.3031, lng: 36.08 }, year: 2024, area_sqm: 680, typology: "Commercial", status: "Concept",
    hero_image_url: image("photo-1487958449943-2429e8be8625"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1487958449943-2429e8be8625"), alt: "Minimal modern architecture beneath an open sky" }], blueprint_urls: [],
    architectural_narrative: "A calm workspace balances deep shade with a changing play of daylight.", featured: false, display_order: 4, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-05", slug: "material-study", title: "Material Study", location: "Kigali, Rwanda",
    coordinates: { lat: -1.9441, lng: 30.0619 }, year: 2022, area_sqm: 148, typology: "Interior", status: "Completed",
    hero_image_url: image("photo-1600566753086-00f18fb6b3ea"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1600566753086-00f18fb6b3ea"), alt: "Tactile contemporary interior with carefully composed materials" }], blueprint_urls: [],
    architectural_narrative: "An interior renovation shaped by honest materials, measured light and reuse.", featured: false, display_order: 5, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "demo-06", slug: "urban-canopy", title: "Urban Canopy", location: "Kampala, Uganda",
    coordinates: { lat: 0.3476, lng: 32.5825 }, year: 2025, area_sqm: 3200, typology: "Urban", status: "Concept",
    hero_image_url: image("photo-1511818966892-d7d671e672a2"), hero_lqip: null, comparison_pairs: [],
    gallery_json: [{ url: image("photo-1511818966892-d7d671e672a2"), alt: "Public space and contemporary urban structure" }], blueprint_urls: [],
    architectural_narrative: "A framework for shade and gathering reconnects a fragmented urban block.", featured: false, display_order: 6, is_published: true, is_demo: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
];
