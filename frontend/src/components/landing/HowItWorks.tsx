import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Bot, Trophy, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Ask Your Question',
    description: 'Type any question into the playground. Whether it\'s coding, research, or creative—our agents are ready.',
  },
  {
    icon: Bot,
    step: '02',
    title: 'Agents Debate in Parallel',
    description: 'Agent A (phi3:mini) and Agent B (qwen2:7b) process your question simultaneously, each providing unique perspectives.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Referee Judges & Scores',
    description: 'The Referee model (deepseek-r1) evaluates both answers on correctness, clarity, and usefulness, then chooses the best.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Enhanced Final Answer',
    description: 'The winning answer is polished and enhanced for clarity and detail, giving you the optimal response.',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background font-display font-bold shadow-lg">
          {step.step}
        </div>
        {index < steps.length - 1 && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-primary/10 my-2" />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 bg-card border border-border rounded-2xl p-6 mb-6 hover:border-foreground/40 transition-all duration-300 card-spotlight">
        <div className="flex items-start gap-4">
          <div className="md:hidden w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background font-display font-bold text-sm shrink-0">
            {step.step}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background mb-4">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2 text-card-foreground">{step.title}</h3>
            <p className="text-card-foreground/80 leading-relaxed">{step.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How the <span className="text-gradient">Orchestrator</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple four-step process that delivers optimal AI-generated answers through intelligent collaboration.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}