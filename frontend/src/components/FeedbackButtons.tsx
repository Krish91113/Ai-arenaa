import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitLabel } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, Loader2, Check } from 'lucide-react';
import { FeedbackLabel } from '@/types/api';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  turnId: number;
}

export function FeedbackButtons({ turnId }: FeedbackButtonsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<FeedbackLabel | null>(null);

  const handleFeedback = async (label: FeedbackLabel) => {
    setIsSubmitting(true);
    try {
      await submitLabel(turnId, label);
      setSubmitted(label);
      toast({
        title: 'Feedback recorded',
        description: `Thank you for your ${label} feedback!`,
      });
    } catch (error) {
      toast({
        title: 'Failed to send feedback',
        description: 'The backend server may not be running.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        <Check className="h-4 w-4" />
        Feedback recorded: {submitted}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm text-muted-foreground">Was this helpful?</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFeedback('good')}
        disabled={isSubmitting}
        className={cn(
          'gap-2 font-mono transition-all hover:scale-105',
          'hover:border-foreground hover:bg-foreground hover:text-background'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        Good
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFeedback('bad')}
        disabled={isSubmitting}
        className={cn(
          'gap-2 font-mono transition-all hover:scale-105',
          'hover:border-foreground hover:bg-foreground hover:text-background'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown className="h-4 w-4" />
        )}
        Bad
      </Button>
    </div>
  );
}
