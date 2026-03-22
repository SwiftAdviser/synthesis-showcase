export function SecurityPitch() {
  const points = [
    "Most agents are exposed to prompt injection",
    "This might cause overspending and loss of funds",
    "Security is a crucial part of the hackathon",
  ];

  return (
    <div className="glassmorphic rounded-xl p-5">
      <h4 className="font-accent text-base font-bold leading-snug mb-4">
        Increase your chances to win
      </h4>

      <div className="space-y-2.5">
        {points.map((p) => (
          <div
            key={p}
            className="flex gap-2.5 text-xs text-text-secondary leading-relaxed"
          >
            <span className="text-accent shrink-0 mt-px">&rsaquo;</span>
            {p}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <span className="text-[11px] font-mono text-accent uppercase tracking-wider">
          Free for participants
        </span>
      </div>
    </div>
  );
}
