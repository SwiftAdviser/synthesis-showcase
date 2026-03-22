# Synthesis Showcase: Design Spec & Implementation Plan

## Context

Mandate wants to build a public good: a beautiful, Product Hunt-style index of all Synthesis hackathon projects, hosted at `synthesis.mandate.md`. Goals:
- Make each project feel special enough that teams share their listing link
- Attract attention to Mandate's agent security via contextual CTAs
- Open source standalone repo as a showcase of Mandate's brand quality

Data source: Synthesis hackathon API at `https://synthesis.devfolio.co` (~338 projects, 46 tracks).

## Architecture Decisions

- **Standalone repo**: `SwiftAdviser/synthesis-showcase`, deployed to Coolify on `krutovoy-vps` (198.244.202.203)
- **Stack**: Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript
- **Data strategy**: Full SSG with ISR. Fetch ALL projects at build time, client-side filtering/search. Revalidate every 5 min.
- **Domain**: `synthesis.mandate.md` (Cloudflare DNS CNAME to VPS)
- **Hosting**: Coolify app, Docker-based Next.js deployment (standalone output mode)

### Deployment Setup

1. **DNS**: Create CNAME record `synthesis.mandate.md` pointing to `198.244.202.203` via Cloudflare MCP/API
2. **Coolify**: Create new application on Coolify (`https://coolz.krutovoy.me`):
   - Source: GitHub repo `SwiftAdviser/synthesis-showcase`
   - Build: Nixpacks or Dockerfile (Next.js standalone)
   - Port: auto-assigned (Next.js default 3000)
   - Domain: `synthesis.mandate.md`
   - Auto-deploy on push to main
3. **next.config.ts**: Set `output: 'standalone'` for Docker-friendly builds
4. **Caddy proxy**: Coolify handles reverse proxy + SSL via its Caddy config automatically

## File Structure

```
synthesis-showcase/
├── public/
│   ├── logo.png                    # Mandate logo
│   ├── fonts/                      # DM Sans, Geist Mono, Fraunces, Space Grotesk
│   └── og-fallback.png             # Default OG image
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: fonts, metadata
│   │   ├── page.tsx                # Homepage (SSG + ISR)
│   │   ├── globals.css             # CSS vars from Mandate branding
│   │   ├── projects/[slug]/page.tsx  # Project detail
│   │   ├── tracks/[slug]/page.tsx    # Track page
│   │   ├── stats/page.tsx            # Stats dashboard
│   │   └── api/og/route.tsx          # OG image generation (Satori)
│   ├── lib/
│   │   ├── api.ts                  # Devfolio API client
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── constants.ts            # Track-to-CTA mapping, colors
│   │   └── utils.ts                # Helpers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Nav with Mandate branding + search trigger
│   │   │   ├── Footer.tsx          # Links, attribution
│   │   │   └── SearchBar.tsx       # Cmd+K overlay, client-side fuzzy search
│   │   ├── project/
│   │   │   ├── ProjectCard.tsx     # PH-style horizontal card for feed
│   │   │   ├── ProjectHero.tsx     # Video embed or cover image
│   │   │   ├── BuildTimeline.tsx   # Commit timeline visualization
│   │   │   ├── TeamSpotlight.tsx   # Team member cards
│   │   │   ├── TechBadges.tsx      # Model/framework/tool pills
│   │   │   └── ProjectLinks.tsx    # Repo, demo, Moltbook links
│   │   ├── track/
│   │   │   ├── TrackCard.tsx       # Track card with prize total
│   │   │   └── PrizeTable.tsx      # Prize breakdown
│   │   ├── stats/
│   │   │   ├── StatCard.tsx        # Single stat with label
│   │   │   └── BarChart.tsx        # CSS-only horizontal bar chart
│   │   ├── mandate/
│   │   │   └── MandateCTA.tsx      # Contextual sidebar CTA
│   │   ├── FilterSidebar.tsx       # Track/model/framework filters
│   │   └── ProjectFeed.tsx         # Card list with client-side filtering
│   └── hooks/
│       └── useFilters.ts           # URL search param filter state
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

## Branding (ported from Mandate)

**Colors** (CSS vars):
- `--bg-base: #09090b`, `--bg-surface: #1C1C1E`, `--bg-raised: #252528`
- `--accent: #10b981` (emerald), `--accent-dim: #065f46`
- `--text-primary: #FFFFFF`, `--text-secondary: #a1a1aa`, `--text-dim: #52525b`
- `--border: #2a2a2e`

**Fonts**: DM Sans (body), Geist Mono (data/code), Fraunces (display headings), Space Grotesk (accent)

**Style**: Glassmorphic cards (`bg-surface/80 backdrop-blur`), monospace labels, thin borders, emerald glow effects, staggered entrance animations.

## Page Designs

### Homepage (`/`)

1. **Hero**: Dark void bg. Fraunces heading "The Synthesis". Subtitle: "338 projects built by agents. Explore what they shipped." Four StatCards: total projects, tracks, models, commits (Geist Mono numbers, emerald accents).

2. **Project Feed** (2-col: filters + cards):
   - **FilterSidebar** (left, 240px, collapsible mobile): checkboxes for Track, Model, Framework, Harness. Active filters as dismissable pills above feed.
   - **ProjectFeed** (right): ProductCard list. Sort: newest (default), most commits, alphabetical. "Load more" pagination (20 per page, client-side).

3. **ProjectCard**: Horizontal layout.
   - Left: cover image thumbnail (120x80) or gradient placeholder
   - Center: name (DM Sans 600), 2-line description, team name
   - Right: track badges (emerald pills), model badge (monospace outlined), tool count
   - Hover: emerald glow border, translateY(-2px)

4. **Track Leaderboard**: Below feed. Horizontal scroll of TrackCards (sponsor, prize pool, project count).

5. **Search**: Cmd+K overlay. Fuzzy search on name + description. Mini-card results. All client-side.

### Project Detail (`/projects/[slug]`)

Two-column: main (65%) + sidebar (35%).

**Main column**:
1. **Hero**: YouTube embed (lite-youtube-embed) if videoURL, else coverImageURL, else gradient placeholder with name
2. **Title block**: Name (Fraunces h1 36px), team name. TechBadges row: model (emerald pill), harness, framework (outlined), tools (first 5 + overflow)
3. **Description**: Full markdown-rendered, DM Sans, generous line-height
4. **Problem Statement**: Left emerald border accent. Monospace uppercase header
5. **Build Timeline**: Horizontal bar, firstCommitAt to lastCommitAt, duration label, commit + contributor counts
6. **Team Spotlight**: Member card grid. Initials avatar (gradient from name hash), name, role badge

**Sidebar**:
1. **MandateCTA**: Contextual based on track (see below)
2. **Links**: GitHub, live demo, Moltbook (icon + label + arrow rows)
3. **Tracks**: Badge links to track pages
4. **Intention**: "Plans to continue" / "Exploring" / "One-time build"

### Track Page (`/tracks/[slug]`)

Track name hero + sponsor. Description. PrizeTable (name, amount, currency). ProjectCard grid of all track projects.

### Stats Page (`/stats`)

Four headline StatCards. CSS-only horizontal BarCharts for: model distribution, framework usage, harness distribution, top 15 tools. Build duration patterns. All computed at build time.

## Mandate CTA (Contextual)

Track category keyword matching in `constants.ts`:

| Track keywords | Headline | Bullets |
|---|---|---|
| DeFi, trading, swap, yield | "Your DeFi agent needs guardrails" | Spend limits, allowlisted contracts, circuit breaker |
| Wallet, payment, transfer | "Secure agent payments" | Per-tx caps, recipient allowlists, approval gates |
| Infrastructure, identity, protocol | "Policy layer for agent infra" | Non-custodial validation, audit trail, multi-chain |
| Privacy, compute, TEE | "Trust but verify" | Envelope verification, intent state machine, audit log |
| Default | "Ship agents that won't drain wallets" | Spend controls, circuit breaker, approval workflows |

Glassmorphic card, emerald border-left, Mandate logo, CTA button to mandate.md.

## OG Image Generation

`/api/og?slug=xxx` via Next.js ImageResponse (Satori). 1200x630px:
- Dark bg (#09090b), emerald top border
- Left 60%: project name (Fraunces), team name (DM Sans), track badges
- Right 40%: cover image or emerald gradient mesh
- Bottom: Mandate logo + "synthesis.mandate.md"

Every page sets `openGraph.images` in `generateMetadata`.

## API Endpoints (Devfolio)

- **Projects**: `https://synthesis.devfolio.co/projects?page=1&limit=50` (paginated, 338 total)
- **Tracks/Catalog**: `https://synthesis.devfolio.co/catalog?page=1&limit=50` (46 total)

## Data Types (from actual API)

```typescript
interface Project {
  uuid: string; slug: string; name: string;
  description: string; problemStatement: string;
  deployedURL: string | null; repoURL: string;
  videoURL: string | null; pictures: string | null;
  coverImageURL: string | null; status: string;
  createdAt: string; updatedAt: string;
  submissionMetadata: SubmissionMetadata;
  tracks: TrackRef[]; team: Team; members: Member[];
}

interface SubmissionMetadata {
  model: string; agentHarness: string; agentFramework: string;
  agentFrameworkOther?: string; agentHarnessOther?: string;
  tools: string[]; skills: string[];
  intention: string; intentionNotes?: string;
  commitCount: number | null; contributorCount: number | null;
  firstCommitAt: string | null; lastCommitAt: string | null;
  helpfulResources?: string[];
}

interface Track {
  uuid: string; slug: string; name: string;
  company: string; description: string;
  prizes: Prize[];
  createdAt: string; updatedAt: string;
}

interface Prize { uuid: string; name: string; description: string; amount: number; currency: string; }
interface Team { uuid: string; name: string; }
interface Member { participantUuid: string; participantName: string; role: string; }
interface TrackRef { uuid: string; slug: string; name: string; description: string; }
```

## Build Sequence

### Phase 1: Scaffold + Data (first)
1. Create repo, scaffold Next.js (App Router, TS, Tailwind)
2. Port Mandate CSS vars into `globals.css`, configure fonts
3. Implement `lib/types.ts`, `lib/api.ts`, `lib/constants.ts`
4. Verify data fetching works

### Phase 2: Homepage (second)
5. Header, Footer layout
6. StatCard, TechBadges, ProjectCard components
7. FilterSidebar + useFilters hook
8. ProjectFeed with client-side filtering
9. Homepage page.tsx: hero + feed + track leaderboard
10. SearchBar (Cmd+K)

### Phase 3: Detail Pages (third)
11. ProjectHero, BuildTimeline, TeamSpotlight, ProjectLinks
12. MandateCTA component
13. Project detail page.tsx with generateStaticParams
14. Track page.tsx with PrizeTable

### Phase 4: Stats + OG (fourth)
15. Stats computation utility
16. BarChart (CSS-only), stats page.tsx
17. OG image route + generateMetadata on all pages

### Phase 5: Polish + Deploy (last)
18. Mobile responsive pass
19. Staggered entrance animations
20. Create GitHub repo `SwiftAdviser/synthesis-showcase`, push code
21. Set up Cloudflare DNS: CNAME `synthesis` on `mandate.md` -> VPS IP
22. Create Coolify app: GitHub source, auto-deploy, domain `synthesis.mandate.md`
23. OG image testing
24. README

## Verification

1. `next build` succeeds, generates all ~338 project pages + 46 track pages
2. Homepage: filters work instantly, search finds projects, stats are accurate
3. Project page: video embeds play, timeline renders, team cards show, CTA appears
4. OG images: `/api/og?slug=xxx` returns valid 1200x630 images
5. Mobile: all pages responsive at 375px
6. Lighthouse Performance > 95
7. Share a project URL on Twitter/Discord: preview card renders correctly
8. `https://synthesis.mandate.md` resolves and serves the app

## Edge Cases

- Null videoURL + null coverImageURL: gradient placeholder with project initials
- Empty tools/skills arrays: hide those badge sections
- agentFramework/Harness "other": show the `*Other` field text
- Very long names: truncate in cards, full on detail
- Missing moltbookPostURL: hide link
- Mixed prize currencies: display as-is with currency label
