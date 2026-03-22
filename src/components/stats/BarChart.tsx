interface Props {
  data: [string, number][];
  title: string;
}

export function BarChart({ data, title }: Props) {
  if (data.length === 0) return null;
  const max = data[0]?.[1] ?? 1;

  return (
    <div className="glassmorphic rounded-xl p-6">
      <h3 className="font-accent text-sm uppercase tracking-wider text-text-secondary mb-4">
        {title}
      </h3>
      <div className="space-y-2.5">
        {data.map(([label, count]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-36 sm:w-44 truncate shrink-0 font-mono">
              {label}
            </span>
            <div className="flex-1 h-5 bg-bg-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/80 rounded-full transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-dim font-mono w-8 text-right shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
