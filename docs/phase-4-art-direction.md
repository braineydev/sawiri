# Phase 4 art direction: Project as publication

Each case study opens as a full image field with the project name, location and archive index layered into the same dark architectural plane. A factual specification rail accompanies a single editorial sequence: the supplied project narrative, curated gallery, technical drawing archive where drawings exist, explicit render-to-drawing comparisons where pairs are configured, a closing image, and a route to the next published project.

The specification rail uses CSS sticky positioning on wide layouts and becomes a compact two-column data block on mobile. Project names use the existing Instrument Serif and technical labels use Geist Mono. Mineral paper, ink and the existing rust accent retain continuity with the index and opening page.

Gallery layout is driven by optional `gallery_json` presentation fields (`layout`, `caption`, `orientation`, `asset_type`, and `display_order`). When those fields are absent, a deterministic layout adapter alternates full, split, detail and portrait compositions. Gallery media excludes the hero asset when the URLs match. Technical drawings use `contain` presentation and are omitted when no drawing URLs are provided.

Render-to-drawing comparisons require explicit `comparison_pairs` records. Migration `002_project_comparison_pairs.sql` adds a JSONB array with an empty default. Each item identifies a unique pair with `id`, `render_url` and `drawing_url`, with optional labels, alt text, caption and display order. No pairing is inferred from gallery order or `blueprint_urls`; the existing demonstration records do not contain fabricated comparison assets.

All case-study copy comes from the project record. Missing narratives, images, coordinates, drawings and comparison pairs are omitted or shown with neutral fallbacks. Local demonstration projects remain marked as demonstrations. The next-project link follows published records in display order and wraps to the first record when appropriate.
