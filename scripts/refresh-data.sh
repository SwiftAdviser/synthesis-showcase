#!/usr/bin/env bash
# Refresh cached project and track data from Devfolio API
# Run locally (API may block server IPs), then commit and push

set -euo pipefail
cd "$(dirname "$0")/.."

node -e "
async function main() {
  const projects = [];
  let page = 1;
  while (true) {
    const res = await fetch(\`https://synthesis.devfolio.co/projects?page=\${page}&limit=50\`);
    const data = await res.json();
    projects.push(...data.data);
    if (page >= data.pagination.totalPages) break;
    page++;
  }

  const tracks = [];
  page = 1;
  while (true) {
    const res = await fetch(\`https://synthesis.devfolio.co/catalog?page=\${page}&limit=50\`);
    const data = await res.json();
    tracks.push(...data.items);
    if (!data.pagination.hasNextPage) break;
    page++;
  }

  const fs = require('fs');
  fs.writeFileSync('src/data/projects.json', JSON.stringify(projects, null, 2));
  fs.writeFileSync('src/data/tracks.json', JSON.stringify(tracks, null, 2));
  console.log(\`Saved \${projects.length} projects and \${tracks.length} tracks\`);
}
main();
"

echo "Data refreshed. Don't forget to commit and push."
