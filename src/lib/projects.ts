import { createClient } from "@/lib/supabase/server";
import { demoProjects } from "@/data/projects";
import type { Project } from "@/types/project";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type ProjectSource = "live" | "local" | "error";
export type ProjectResult = { projects: Project[]; source: ProjectSource; error?: string };

const allowDemoProjects = process.env.NODE_ENV !== "production";

function unavailableResult(source: ProjectSource, error?: string): ProjectResult {
  return {
    projects: allowDemoProjects ? demoProjects : [],
    source,
    ...(error ? { error: "The project archive is temporarily unavailable." } : {}),
  };
}

export async function getProjects(): Promise<ProjectResult> {
  let supabase: SupabaseClient<Database> | null;
  try {
    supabase = await createClient();
  } catch {
    return unavailableResult("error", "Supabase client initialization failed");
  }
  if (!supabase) return unavailableResult("local");
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("is_published", true).eq("is_demo", false).order("display_order");
    if (error) return unavailableResult("error", error.message);
    return { projects: (data ?? []) as Project[], source: "live" };
  } catch {
    return unavailableResult("error", "Project query failed");
  }
}
