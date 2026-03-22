export function parseGitHubURL(
  repoURL: string
): { owner: string; repo: string } | null {
  const match = repoURL.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/
  );
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function fetchReadme(repoURL: string): Promise<string | null> {
  const parsed = parseGitHubURL(repoURL);
  if (!parsed) return null;

  const { owner, repo } = parsed;

  for (const branch of ["main", "master"]) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const text = await res.text();
        return text.trim() || null;
      }
    } catch {
      // timeout or network error, try next branch
    }
  }

  return null;
}

export function getGitHubRawBase(repoURL: string, branch = "main"): string {
  const parsed = parseGitHubURL(repoURL);
  if (!parsed) return "";
  return `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}`;
}
