interface Props {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: Props) {
  return (
    <div className="glassmorphic rounded-xl p-5">
      <p className="font-mono text-3xl sm:text-4xl font-bold text-accent tracking-tight">
        {value}
      </p>
      <p className="text-sm text-text-secondary mt-1 font-accent uppercase tracking-wider">
        {label}
      </p>
      {sublabel && (
        <p className="text-xs text-text-dim mt-0.5">{sublabel}</p>
      )}
    </div>
  );
}
