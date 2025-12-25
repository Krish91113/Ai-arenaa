import { useState } from 'react';
import { HistoryItem as HistoryItemType } from '@/types/api';
import { ChevronDown, ChevronUp, Calendar, Bot, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeedbackButtons } from './FeedbackButtons';
import { motion } from 'framer-motion';

interface HistoryItemProps {
  item: HistoryItemType;
}

function LabelBadge({ label }: { label: 'good' | 'bad' | null }) {
  if (!label) {
    return (
      <span className="flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />
        Unlabeled
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs',
        label === 'good'
          ? 'border border-foreground bg-foreground text-background'
          : 'border border-border bg-secondary text-muted-foreground'
      )}
    >
      {label === 'good' ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
      {label === 'good' ? 'Good' : 'Bad'}
    </span>
  );
}

export function HistoryItemCard({ item }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const avgScore = Math.round(
    (item.referee.scores.correctness +
      item.referee.scores.clarity +
      item.referee.scores.usefulness) /
      3
  );

  const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const truncatedQuestion =
    item.question.length > 80
      ? item.question.substring(0, 80) + '...'
      : item.question;

  return (
    <motion.div
      className="rounded-xl border border-border bg-card transition-all hover:border-foreground/50 card-spotlight"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 text-xs text-card-foreground/70">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Bot className="h-3 w-3" />
              {item.chosen_agent === 'agent_a' ? 'Agent A' : 'Agent B'}
            </span>
            <span className="font-mono">Score: {avgScore}/10</span>
          </div>
          <p className="font-mono text-sm text-card-foreground">{truncatedQuestion}</p>
        </div>
        <div className="flex items-center gap-3">
          <LabelBadge label={item.human_label} />
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-card-foreground/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-card-foreground/70" />
          )}
        </div>
      </button>

      <div
        className={cn(
            'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-border p-4 space-y-4">
          <div>
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-card-foreground/70">
              Full Question
            </h4>
            <p className="text-sm text-card-foreground">{item.question}</p>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-card-foreground/70">
              Referee Scores
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md bg-secondary p-3 text-center">
                <p className="font-mono text-lg font-semibold text-card-foreground">{item.referee.scores.correctness}</p>
                <p className="font-mono text-xs text-card-foreground/70">Correctness</p>
              </div>
              <div className="rounded-md bg-secondary p-3 text-center">
                <p className="font-mono text-lg font-semibold text-card-foreground">{item.referee.scores.clarity}</p>
                <p className="font-mono text-xs text-card-foreground/70">Clarity</p>
              </div>
              <div className="rounded-md bg-secondary p-3 text-center">
                <p className="font-mono text-lg font-semibold text-card-foreground">{item.referee.scores.usefulness}</p>
                <p className="font-mono text-xs text-card-foreground/70">Usefulness</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-card-foreground/70">
              Critique
            </h4>
            <p className="text-sm text-card-foreground/80">{item.referee.critique}</p>
          </div>

          <div className="rounded-lg border border-foreground/70 bg-foreground p-4 text-background shadow-lg">
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-background/60">
              Enhanced Answer
            </h4>
            <p className="text-sm">{item.enhanced_answer}</p>
          </div>

          {!item.human_label && (
            <div className="pt-2">
              <FeedbackButtons turnId={item.turn_id} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
