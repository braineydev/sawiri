import type { Project } from "@/types/project";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at" | "comparison_pairs"> & Partial<Pick<Project, "id" | "created_at" | "updated_at" | "comparison_pairs">>;
        Update: Partial<Omit<Project, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string; client_name: string; email: string; project_typology: Project["typology"] | null;
          estimated_area_sqm: number | null; budget_tier: string | null; location: string | null; message: string; created_at: string;
        };
        Insert: {
          id?: string; client_name: string; email: string; project_typology?: Project["typology"] | null;
          estimated_area_sqm?: number | null; budget_tier?: string | null; location?: string | null; message: string; created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
