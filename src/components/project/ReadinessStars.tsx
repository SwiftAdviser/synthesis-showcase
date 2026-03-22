interface Props {
  score: number;
}

export function ReadinessStars({ score }: Props) {
  return (
    <div className="flex gap-px" title={`Readiness: ${score}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i <= score ? "bg-accent" : "bg-bg-raised"
          }`}
        />
      ))}
    </div>
  );
}
