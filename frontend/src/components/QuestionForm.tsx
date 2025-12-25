import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question to start the multi-agent debate..."
          className="min-h-[120px] resize-none bg-card font-mono text-sm transition-all focus:ring-2 focus:ring-ring"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['General', 'Coding', 'Business'].map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {domain}
            </span>
          ))}
        </div>
        <Button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="gap-2 font-mono transition-all hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Ask AI
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
