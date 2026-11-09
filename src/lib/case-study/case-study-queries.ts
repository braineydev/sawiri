import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoProjects } from "@/data/projects";
import type { CaseStudyProject, Project } from "@/types/project";
import type { Database } from "@/types/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { adaptProject } from "@/lib/case-study/case-study-adapter";

export type CaseStudySource = "live" | "local" | "error";
export type CaseStudyResult = { project: CaseStudyProject | null; source: CaseStudySource; error?: string };
export type NextProject = Pick<Project, "id" | "slug" | "title" | "location" | "hero_image_url" | "hero_lqip" | "display_order">;

const projectFields = "id,slug,title,location,coordinates,year,area_sqm,typology,status,hero_image_url,hero_lqip,gallery_json,blueprint_urls,comparison_pairs,architectural_narrative,featured,display_order,is_published,is_demo";
const nextFields = "id,slug,title,location,hero_image_url,hero_lqip,display_order";

function demoCaseStudy(slug: string, source: CaseStudySource = "local", error?: string): CaseStudyResult {
  const demo = demoProjects.find((project) => project.slug === slug);
  return { project: demo ? adaptProject(demo) : null, source, error: demo ? undefined : error };
}

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudyResult> => {
  let supabase: SupabaseClient<Database> | null;
  try {
    supabase = await createClient();
  } catch {
    return demoCaseStudy(slug, "error", "Project service unavailable");
  }
  if (!supabase) {
    return demoCaseStudy(slug);
  }

  try {
    const { data, error } = await supabase.from("projects").select(projectFields).eq("slug", slug).eq("is_published", true).eq("is_demo", false).maybeSingle();
    if (error) {
      return demoCaseStudy(slug, "error", "Project query failed");
    }
    return data ? { project: adaptProject(data as Project), source: "live" } : demoCaseStudy(slug);
  } catch {
    return demoCaseStudy(slug, "error", "Project query failed");
  }
});

function demoNextProject(project: CaseStudyProject): NextProject | null {
  const ordered = [...demoProjects].sort((a, b) => a.display_order - b.display_order || a.id.localeCompare(b.id));
  if (ordered.length < 2) return null;
  const index = ordered.findIndex((item) => item.id === project.id);
  if (index < 0) return null;
  const next = ordered[(index + 1) % ordered.length];
  return { id: next.id, slug: next.slug, title: next.title, location: next.location, hero_image_url: next.hero_image_url, hero_lqip: next.hero_lqip, display_order: next.display_order };
}

export async function getNextProject(project: CaseStudyProject, source: CaseStudySource): Promise<NextProject | null> {
  if (source !== "live") return demoNextProject(project);
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const afterFilter = `display_order.gt.${project.display_order},and(display_order.eq.${project.display_order},id.gt.${project.id})`;
    const { data: next, error } = await supabase.from("projects").select(nextFields).eq("is_published", true).eq("is_demo", false).neq("id", project.id).or(afterFilter).order("display_order", { ascending: true }).order("id", { ascending: true }).limit(1).maybeSingle();
    if (error) return null;
    if (next) return next as NextProject;
    const { data: first, error: firstError } = await supabase.from("projects").select(nextFields).eq("is_published", true).eq("is_demo", false).neq("id", project.id).order("display_order", { ascending: true }).order("id", { ascending: true }).limit(1).maybeSingle();
    return firstError || !first ? null : first as NextProject;
  } catch {
    return null;
  }
}
