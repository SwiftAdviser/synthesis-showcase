"use client";

import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  content: string;
  rawBase: string;
}

const COLLAPSED_HEIGHT = 600;

export function ReadmeSection({ content, rawBase }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsExpand(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [content]);

  function resolveUrl(src: string | undefined): string {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
      return src;
    }
    const clean = src.replace(/^\.\//, "");
    return `${rawBase}/${clean}`;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-text-dim">
          <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574zM8.755 4.75l-.004 7.322a3.752 3.752 0 011.992-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
        </svg>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
          README
        </h3>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        <div
          ref={contentRef}
          className="github-markdown p-6 relative"
          style={{
            maxHeight: !expanded && needsExpand ? `${COLLAPSED_HEIGHT}px` : undefined,
            overflow: !expanded && needsExpand ? "hidden" : undefined,
          }}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...props}
                  src={resolveUrl(typeof src === "string" ? src : undefined)}
                  alt={alt ?? ""}
                  loading="lazy"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              ),
              a: ({ href, children, ...props }) => (
                <a
                  {...props}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </Markdown>

          {!expanded && needsExpand && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
          )}
        </div>

        {needsExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-3 text-sm text-accent hover:text-accent/80 transition-colors border-t border-border font-mono"
          >
            {expanded ? "Collapse README" : "Show full README"}
          </button>
        )}
      </div>
    </div>
  );
}
