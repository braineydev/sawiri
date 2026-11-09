import Link from "next/link";

export default function ProjectNotFound() {
  return <main className="case-route-state page-gutter"><span className="mono">REEL ARCHER / PROJECT ARCHIVE / 404</span><h1>This project<br /><em>is not available.</em></h1><p>The project may have moved or may not be published.</p><Link href="/projects">RETURN TO PROJECT INDEX</Link></main>;
}
