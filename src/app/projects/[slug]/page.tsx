import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { getCaseStudyBySlug, getNextProject } from "@/lib/case-study/case-study-queries";
import type { CaseStudySource } from "@/lib/case-study/case-study-queries";
import type { CaseStudyProject } from "@/types/project";
import { CaseStudyLoading } from "@/components/case-study/CaseStudyLoading";
import { canIndexSite, canonicalOrigin, noIndexRobots } from "@/lib/seo/site-config";
import { projectJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project, source, error } = await getCaseStudyBySlug(slug);
  if (!project && error) return { title: "Project temporarily unavailable", robots: { index: false, follow: false } };
  if (!project) notFound();

  const description = project.architectural_narrative || `${project.title}${project.location ? ` — ${project.location}` : ""}${project.year > 0 ? ` / ${project.year}` : ""}.`;
  const indexOrigin = canIndexSite && canonicalOrigin && source === "live" && project.is_published && !project.is_demo
    ? canonicalOrigin
    : null;
  const publiclyIndexable = indexOrigin !== null;
  const canonical = indexOrigin ? new URL(`/projects/${encodeURIComponent(project.slug)}`, indexOrigin).toString() : undefined;
  const generatedImage = indexOrigin ? new URL(`/api/og/project?slug=${encodeURIComponent(project.slug)}`, indexOrigin).toString() : undefined;
  return {
    title: project.title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      ...(generatedImage ? { images: [{ url: generatedImage, alt: `${project.title}, architectural project study` }] } : {}),
    },
    twitter: { card: "summary_large_image", title: project.title, description, ...(generatedImage ? { images: [generatedImage] } : {}) },
    ...(!publiclyIndexable ? { robots: noIndexRobots } : {}),
  };
}

export default async function ProjectCaseStudy({ params }: PageProps) {
  const { slug } = await params;
  const result = await getCaseStudyBySlug(slug);
  if (result.error && !result.project) throw new Error("Project information is temporarily unavailable.");
  if (!result.project) notFound();
  const jsonLd = result.source === "live" ? projectJsonLd(result.project) : null;
  return <>{jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}<Suspense fallback={<CaseStudyLoading />}><CaseStudyContent project={result.project} source={result.source} /></Suspense></>;
}

async function CaseStudyContent({ project, source }: { project: CaseStudyProject; source: CaseStudySource }) {
  const nextProject = await getNextProject(project, source);
  return <CaseStudyPage project={project} source={source} nextProject={nextProject} />;
}
