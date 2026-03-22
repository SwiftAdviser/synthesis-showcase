import type { SubmissionMetadata } from "@/lib/types";
import { getDisplayModel, getDisplayFramework, getDisplayHarness } from "@/lib/utils";

interface Props {
  metadata: SubmissionMetadata;
  compact?: boolean;
}

export function TechBadges({ metadata, compact }: Props) {
  const model = getDisplayModel(metadata);
  const framework = getDisplayFramework(metadata);
  const harness = getDisplayHarness(metadata);
  const tools = metadata.tools ?? [];
  const maxTools = compact ? 3 : 5;

  return (
    <div className="flex flex-wrap gap-1.5">
      {model && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono bg-accent/15 text-accent border border-accent/30">
          {model}
        </span>
      )}
      {harness && harness !== "Unknown" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono border border-border text-text-secondary">
          {harness}
        </span>
      )}
      {framework && framework !== "Unknown" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono border border-border text-text-secondary">
          {framework}
        </span>
      )}
      {tools.slice(0, maxTools).map((tool) => (
        <span
          key={tool}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono bg-bg-raised text-text-dim"
        >
          {tool}
        </span>
      ))}
      {tools.length > maxTools && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono text-text-dim">
          +{tools.length - maxTools}
        </span>
      )}
    </div>
  );
}
