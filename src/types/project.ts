export type ProjectTypology = "Residential" | "Commercial" | "Cultural" | "Interior" | "Urban";
export type ProjectStatus = "Completed" | "In Progress" | "Concept";
export type ProjectGalleryLayout = "full" | "split" | "portrait" | "detail" | "technical";
export type ProjectGalleryAsset = {
  url: string;
  alt: string;
  caption?: string;
  layout?: ProjectGalleryLayout;
  asset_type?: string;
  orientation?: "portrait" | "landscape" | "square";
  display_order?: number;
};
export type ProjectComparisonPair = {
  id: string;
  render_url: string;
  drawing_url: string;
  caption?: string;
  render_label?: string;
  drawing_label?: string;
  render_alt?: string;
  drawing_alt?: string;
  display_order?: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  year: number;
  area_sqm: number | null;
  typology: ProjectTypology;
  status: ProjectStatus;
  hero_image_url: string;
  hero_lqip: string | null;
  gallery_json: ProjectGalleryAsset[];
  blueprint_urls: string[];
  comparison_pairs: ProjectComparisonPair[];
  architectural_narrative: string;
  featured: boolean;
  display_order: number;
  is_published: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

export type PortfolioProject = Pick<Project,
  | "id" | "slug" | "title" | "location" | "year" | "area_sqm" | "typology" | "status"
  | "hero_image_url" | "hero_lqip" | "gallery_json" | "architectural_narrative"
  | "featured" | "display_order" | "is_demo"
>;

export type CaseStudyProject = Pick<Project,
  | "id" | "slug" | "title" | "location" | "coordinates" | "year" | "area_sqm" | "typology" | "status"
  | "hero_image_url" | "hero_lqip" | "gallery_json" | "blueprint_urls" | "comparison_pairs"
  | "architectural_narrative" | "featured" | "display_order" | "is_published" | "is_demo"
>;
