import type { ProjectTypology } from "@/types/project";

const typologies: ProjectTypology[] = ["Residential", "Commercial", "Cultural", "Interior", "Urban"];
const budgetTiers = ["Under 5M", "5M–20M", "20M–50M", "50M+"];

export type ValidatedInquiry = {
  client_name: string; email: string; project_typology: ProjectTypology;
  estimated_area_sqm: number | null; budget_tier: string | null; location: string | null; message: string;
};

export function validateInquiry(input: unknown): { value?: ValidatedInquiry; error?: string; honeypot?: boolean; token?: string; elapsedMs?: number; acknowledgement?: boolean } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "The submitted project brief is incomplete." };
  const data = input as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim()) return { honeypot: true };
  if (typeof data.client_name !== "string" || typeof data.email !== "string" || typeof data.message !== "string") return { error: "Please complete the required project and contact details." };
  const client_name = data.client_name.trim().replace(/\s+/g, " ");
  const email = data.email.trim().toLowerCase();
  const message = data.message.trim();
  const location = typeof data.location === "string" ? data.location.trim().replace(/\s+/g, " ") : "";
  if (client_name.length < 2 || client_name.length > 160) return { error: "Enter a name between 2 and 160 characters." };
  if (email.length > 254 || !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return { error: "Enter a valid email address." };
  if (typeof data.project_typology !== "string" || !typologies.includes(data.project_typology as ProjectTypology)) return { error: "Choose a valid project type." };
  let area: number | null = null;
  if (data.estimated_area_sqm !== null && data.estimated_area_sqm !== undefined && data.estimated_area_sqm !== "") {
    const rawArea = typeof data.estimated_area_sqm === "number" ? String(data.estimated_area_sqm) : data.estimated_area_sqm;
    if (typeof rawArea !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(rawArea)) return { error: "Enter a valid positive area, or leave it blank." };
    area = Number(rawArea);
    if (!Number.isFinite(area) || area <= 0 || area > 1_000_000_000) return { error: "Enter a valid positive area, or leave it blank." };
  }
  const tier = data.budget_tier === null || data.budget_tier === undefined || data.budget_tier === "" ? null : data.budget_tier;
  if (tier !== null && (typeof tier !== "string" || !budgetTiers.includes(tier))) return { error: "Choose a valid budget category." };
  if (location.length > 180) return { error: "Keep the location under 180 characters." };
  if (message.length < 10 || message.length > 10000) return { error: "The project description must be between 10 and 10,000 characters." };
  const token = typeof data.turnstileToken === "string" ? data.turnstileToken : "";
  const elapsedMs = typeof data.elapsedMs === "number" && Number.isFinite(data.elapsedMs) ? data.elapsedMs : 0;
  return { value: { client_name, email, project_typology: data.project_typology as ProjectTypology, estimated_area_sqm: area, budget_tier: tier as string | null, location: location || null, message }, token, elapsedMs, acknowledgement: data.acknowledgement === true };
}
