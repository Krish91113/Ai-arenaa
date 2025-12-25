import { motion } from 'framer-motion';
import { Bot, Trophy, Sparkles, Check } from 'lucide-react';

export function HeroPreview() {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-2xl opacity-60" />
      
      {/* Main container */}
      <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/50" />
            <div className="w-3 h-3 rounded-full bg-muted" />
            <div className="w-3 h-3 rounded-full bg-primary/50" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">Multi-Agent Arena</span>
        </div>

        {/* Agent panels */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-secondary/50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Agent A</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-muted rounded w-full" />
              <div className="h-2 bg-muted rounded w-4/5" />
              <div className="h-2 bg-muted rounded w-3/4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-secondary/50 rounded-lg p-3 border-2 border-primary/50 glow-soft"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Agent B</span>
              <Check className="h-3 w-3 text-primary ml-auto" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-primary/20 rounded w-full" />
              <div className="h-2 bg-primary/20 rounded w-5/6" />
              <div className="h-2 bg-primary/20 rounded w-2/3" />
            </div>
          </motion.div>
        </div>

        {/* Referee panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-accent/30 rounded-lg p-3 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Referee Decision</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Correctness</span>
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-primary rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span>Clarity</span>
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="w-11/12 h-full bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final answer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-primary rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Final Enhanced Answer</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-primary-foreground/20 rounded w-full" />
            <div className="h-2 bg-primary-foreground/20 rounded w-5/6" />
            <div className="h-2 bg-primary-foreground/20 rounded w-4/5" />
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-2 shadow-lg"
      >
        <span className="text-xs font-medium">phi3:mini</span>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-2 shadow-lg"
      >
        <span className="text-xs font-medium">deepseek-r1</span>
      </motion.div>
    </div>
  );
}