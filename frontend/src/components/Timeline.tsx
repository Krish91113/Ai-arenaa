import { cn } from '@/lib/utils';
import { MessageSquare, Users, Scale, Sparkles } from 'lucide-react';

interface TimelineProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Question', icon: MessageSquare },
  { id: 2, label: 'Agents Debate', icon: Users },
  { id: 3, label: 'Referee Judges', icon: Scale },
  { id: 4, label: 'Enhanced Answer', icon: Sparkles },
];

export function Timeline({ currentStep }: TimelineProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id <= currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'flex flex-col items-center gap-2 transition-all duration-500',
                isActive ? 'opacity-100' : 'opacity-30'
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCurrent
                    ? 'border-foreground bg-foreground text-background scale-110'
                    : isActive
                    ? 'border-foreground bg-transparent text-foreground'
                    : 'border-muted bg-transparent text-muted'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  'font-mono text-xs transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 w-8 transition-colors duration-500 md:w-16',
                  step.id < currentStep ? 'bg-foreground' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
