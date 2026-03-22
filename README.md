# Synthesis Showcase

Product Hunt-style index of 340+ AI agent projects from the [Synthesis Hackathon](https://synthesis.md). Built with Next.js 16, Tailwind CSS 4, and TypeScript.

Live at [synthesis.mandate.md](https://synthesis.mandate.md)

## Stack

- **Framework**: Next.js 16 (App Router, SSG)
- **Styling**: Tailwind CSS 4
- **Data**: Cached JSON from Devfolio API (340 projects, 46 tracks)
- **Hosting**: Coolify on VPS, Cloudflare proxy

## Development

```bash
bun install
bun run dev
```

## Refresh Data

```bash
bash scripts/refresh-data.sh
```

Fetches latest project/track data from Devfolio API. Must run locally (API may block server IPs). Commit and push after refresh.

## Build

```bash
bun run build
bun run start
```

## License

MIT

Built by [Mandate](https://mandate.md)
