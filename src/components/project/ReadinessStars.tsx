import Link from "next/link";

interface Props {
  score: number;
}

export function ReadinessStars({ score }: Props) {
  return (
    <Link
      href="/scoring"
      className="group/stars relative flex gap-px cursor-pointer"
      title={`Readiness: ${score}/5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i <= score ? "bg-accent group-hover/stars:bg-accent/70" : "bg-bg-raised group-hover/stars:bg-border"
          }`}
        />
      ))}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded bg-bg-raised border border-border text-[10px] font-mono text-text-secondary whitespace-nowrap opacity-0 group-hover/stars:opacity-100 transition-opacity pointer-events-none">
        {score}/5 readiness
      </div>
    </Link>
  );
}
