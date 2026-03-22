import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <span className="text-bg-base font-bold text-xs font-accent">M</span>
            </div>
            <div>
              <p className="text-sm font-medium">Synthesis Showcase</p>
              <p className="text-xs text-text-dim">
                Built by{" "}
                <a
                  href="https://mandate.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Mandate
                </a>
                {" "}with ❤️ for agentic economy
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Projects
            </Link>
            <Link href="/stats" className="hover:text-text-primary transition-colors">
              Stats
            </Link>
            <a
              href="https://github.com/SwiftAdviser/synthesis-showcase"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://mandate.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              Mandate
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-xs text-text-dim">
          Data sourced from the{" "}
          <a
            href="https://synthesis.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Synthesis Hackathon
          </a>{" "}
          on Devfolio. For inquiries:{" "}
          <a
            href="mailto:alan@mandate.md"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            alan@mandate.md
          </a>
        </div>
      </div>
    </footer>
  );
}
