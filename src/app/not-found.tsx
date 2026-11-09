import Link from "next/link";

export default function NotFound() {
  return <main className="case-route-state page-gutter"><span className="mono">REEL ARCHER / 404</span><h1>This page<br /><em>is not available.</em></h1><p>The requested page could not be found.</p><Link href="/">RETURN HOME</Link></main>;
}
