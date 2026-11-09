export type ContentStatus = "provisional" | "verified";

export type StudioMethod = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  image?: string;
  imageAlt?: string;
};

export type StudioLedgerEntry = {
  id: string;
  year: number;
  title: string;
  organization: string;
  category?: string;
  url?: string;
  description?: string;
};

export const studioConfig = {
  contentStatus: "provisional" as ContentStatus,
  hero: {
    eyebrow: "REEL ARCHER / STUDIO NOTES",
    title: "Thinking in space.",
    titleSecond: "Building with intent.",
    note: "A working portrait of the practice — prepared for Reel Archer’s approved voice and point of view.",
  },
  introduction: {
    label: "A PRACTICE IN FORMATION",
    heading: "Architecture begins with attention.",
    body: "This studio portrait is a content-ready framework. Replace this provisional statement with Reel Archer’s own account of its design approach, context and work before presenting it as official studio philosophy.",
  },
  philosophy: {
    label: "POINT OF VIEW / DRAFT",
    statement: "Space is shaped by what we choose to notice.",
    body: "Use this space to describe Reel Archer’s verified architectural philosophy: the questions that guide a project, the context that informs a response, and the relationship between an idea and its built expression.",
  },
  principles: [
    { id: "context", title: "Read the context", summary: "Describe how place, use and existing conditions inform a project." },
    { id: "material", title: "Make material matter", summary: "Set out Reel Archer’s considered relationship with material, light and construction." },
    { id: "clarity", title: "Carry an idea through", summary: "Explain how an architectural intention is developed into practical decisions." },
  ],
  methodology: [
    { id: "01", title: "Discovery", summary: "Understand the brief, site and project objectives.", detail: "A provisional stage description. Replace it with Reel Archer’s approved account of how a project begins." },
    { id: "02", title: "Research", summary: "Consider the spatial, contextual and environmental conditions.", detail: "A provisional stage description. Use this space to describe research activities actually undertaken by the practice." },
    { id: "03", title: "Concept", summary: "Develop an initial architectural direction.", detail: "A provisional stage description. Describe how Reel Archer tests, discusses and develops early ideas." },
    { id: "04", title: "Development", summary: "Refine the design and coordinate project information.", detail: "A provisional stage description. Confirm the scope and terminology before publishing as the studio process." },
    { id: "05", title: "Realisation", summary: "Support progression toward architectural execution.", detail: "A provisional stage description. Clarify Reel Archer’s role at this stage using verified service information." },
  ] satisfies StudioMethod[],
  awards: [] as StudioLedgerEntry[],
  press: [] as StudioLedgerEntry[],
  inquiry: {
    budgetOptions: [{ id: "discuss", label: "I would prefer to discuss this", value: null as string | null }],
    acknowledgement: "I confirm that the information above is accurate to the best of my knowledge.",
  },
} as const;
