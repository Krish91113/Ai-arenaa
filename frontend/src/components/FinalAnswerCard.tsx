import { EnhancedAnswer } from '@/types/api';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinalAnswerCardProps {
  enhancedAnswer: EnhancedAnswer;
  animationDelay?: string;
}

export function FinalAnswerCard({ enhancedAnswer, animationDelay = '0ms' }: FinalAnswerCardProps) {
  return (
    <motion.div
      className="animate-fade-in-up rounded-xl border-2 border-foreground/70 bg-foreground p-6 text-background opacity-0 shadow-lg card-spotlight"
      style={{ animationDelay }}
      whileHover={{ 
        y: -6,
        scale: 1.01,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-background/20 ring-1 ring-background/40">
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <h3 className="font-mono text-lg font-semibold tracking-tight">Final Enhanced Answer</h3>
      </div>

      <p className="mb-4 text-lg leading-relaxed">
        {enhancedAnswer.answer}
      </p>

      <p className="font-mono text-xs text-background/60">
        Polished by Enhancer Agent ({enhancedAnswer.model})
      </p>
    </motion.div>
  );
}
