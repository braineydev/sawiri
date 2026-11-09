"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CaseStudyError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Case study route failed", error.digest ?? "unclassified"); }, [error.digest]);
  return <main className="case-route-state page-gutter"><span className="mono">REEL ARCHER / PROJECT ARCHIVE</span><h1>This study is<br /><em>temporarily closed.</em></h1><p>The project information could not be opened. Please return to the archive or try again.</p><div><button type="button" onClick={reset}>TRY AGAIN</button><Link href="/projects">RETURN TO PROJECTS</Link></div></main>;
}
