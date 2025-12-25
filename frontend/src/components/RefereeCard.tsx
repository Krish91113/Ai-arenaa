import { RefereeResult } from '@/types/api';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';

interface RefereeCardProps {
  referee: RefereeResult;
  animationDelay?: string;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-xs">
        <span className="text-card-foreground/70">{label}</span>
        <span>{score}/10</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-score-bar-bg">
        <div
          className="h-full rounded-full bg-score-bar transition-all duration-500 ease-out"
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export function RefereeCard({ referee, animationDelay = '0ms' }: RefereeCardProps) {
  const chosenLabel = referee.chosen_agent === 'agent_a' ? 'Agent A' : 'Agent B';

  return (
    <motion.div
      className="animate-fade-in-up rounded-xl border border-border bg-card p-5 opacity-0 card-spotlight"
      style={{ animationDelay }}
      whileHover={{ 
        y: -6,
        scale: 1.01,
        boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.15)',
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary/70 ring-1 ring-border">
          <Scale className="h-4 w-4 text-card-foreground" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold tracking-tight">Referee</h3>
          <p className="font-mono text-[11px] uppercase text-card-foreground/70">{referee.model}</p>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-secondary/80 p-3 ring-1 ring-border/60">
        <p className="font-mono text-sm text-card-foreground">
          Chosen Agent:{' '}
          <span className="font-semibold text-card-foreground">{chosenLabel}</span>
        </p>
      </div>

      <div className="mb-4 space-y-3">
        <ScoreBar label="Correctness" score={referee.scores.correctness} />
        <ScoreBar label="Clarity" score={referee.scores.clarity} />
        <ScoreBar label="Usefulness" score={referee.scores.usefulness} />
      </div>

      <div>
        <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-card-foreground/70">
          Critique
        </h4>
        <p className="text-sm leading-relaxed text-card-foreground/80">
          {referee.critique}
        </p>
      </div>
    </motion.div>
  );
}
