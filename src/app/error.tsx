"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Application route error", error.digest ?? "unclassified"); }, [error.digest]);
  return <main className="case-route-state page-gutter"><span className="mono">REEL ARCHER / TEMPORARY INTERRUPTION</span><h1>This page is<br /><em>temporarily closed.</em></h1><p>The page could not be opened. Try again or return to the project index.</p><div><button type="button" onClick={reset}>TRY AGAIN</button><Link href="/">RETURN HOME</Link></div></main>;
}
