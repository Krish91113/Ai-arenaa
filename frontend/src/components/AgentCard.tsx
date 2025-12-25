import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AgentResult } from '@/types/api';
import { ChevronDown, ChevronUp, Bot } from 'lucide-react';

interface AgentCardProps {
  agent: AgentResult;
  label: 'A' | 'B';
  isWinner: boolean;
  animationDelay?: string;
}

export function AgentCard({ agent, label, isWinner, animationDelay = '0ms' }: AgentCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-5 opacity-0 transition-all duration-300 animate-fade-in-up card-spotlight',
        isWinner
          ? 'border-foreground/70 shadow-[0_0_24px_rgba(0,0,0,0.2)]'
          : 'border-border hover:border-foreground/60'
      )}
      style={{ animationDelay }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isWinner && (
        <div className="absolute right-3 top-3 animate-glow-pulse">
          <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-xs text-background shadow-lg">
            WINNER
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary/70 ring-1 ring-border">
          <Bot className="h-4 w-4 text-card-foreground" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-semibold tracking-tight text-card-foreground">Agent {label}</h3>
          <p className="font-mono text-[11px] uppercase text-card-foreground/70">{agent.model}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-card-foreground">{agent.answer}</p>

        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-1 font-mono text-xs text-card-foreground/70 transition-colors hover:text-card-foreground"
        >
          {showReasoning ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Hide reasoning
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show reasoning
            </>
          )}
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-200',
            showReasoning ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="rounded-md bg-secondary/70 p-3 ring-1 ring-border/60 animate-card-pop">
            <p className="font-mono text-xs text-card-foreground/80 leading-relaxed">
              {agent.reasoning}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
