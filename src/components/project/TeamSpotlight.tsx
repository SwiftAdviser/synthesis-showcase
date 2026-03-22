import type { Member } from "@/lib/types";
import { hashGradient } from "@/lib/utils";
import { Bot, BotMessageSquare, Cpu, CircuitBoard, Cog } from "lucide-react";

const ROBOT_ICONS = [Bot, BotMessageSquare, Cpu, CircuitBoard, Cog];

function hashIndex(name: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

interface Props {
  members: Member[];
}

export function TeamSpotlight({ members }: Props) {
  if (members.length === 0) return null;

  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
        Team
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {members.map((m) => {
          const Icon = ROBOT_ICONS[hashIndex(m.participantName, ROBOT_ICONS.length)];
          return (
            <div
              key={m.participantUuid}
              className="glassmorphic rounded-lg p-3 flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: hashGradient(m.participantName) }}
              >
                <Icon size={16} className="text-white/80" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{m.participantName}</p>
                <p className="text-[10px] text-text-dim font-mono">{m.role}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
