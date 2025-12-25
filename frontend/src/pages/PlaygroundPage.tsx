import { useMemo, useState } from 'react';
import { QuestionForm } from '@/components/QuestionForm';
import { Timeline } from '@/components/Timeline';
import { AgentCard } from '@/components/AgentCard';
import { RefereeCard } from '@/components/RefereeCard';
import { FinalAnswerCard } from '@/components/FinalAnswerCard';
import { FeedbackButtons } from '@/components/FeedbackButtons';
import { LoadingState } from '@/components/LoadingState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { askQuestion } from '@/lib/api';
import { AskResponse } from '@/types/api';
import { MessageSquare, Sparkles, Code, Briefcase, Sparkle } from 'lucide-react';

const modes = [
  { id: 'general', label: 'General', icon: Sparkles, hint: 'Everyday Q&A with depth' },
  { id: 'coding', label: 'Coding', icon: Code, hint: 'Code help, debugging, snippets' },
  { id: 'business', label: 'Business', icon: Briefcase, hint: 'Strategy, marketing, ops' },
  { id: 'creative', label: 'Creative', icon: Sparkle, hint: 'Brainstorming & writing' },
] as const;

export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');
  const [mode, setMode] = useState<(typeof modes)[number]['id']>('general');

  const modeHint = useMemo(() => modes.find((m) => m.id === mode)?.hint ?? '', [mode]);

  const handleSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setCurrentStep(1);
    setLastQuestion(question);

    try {
      const data = await askQuestion(question);
      setCurrentStep(4);
      setResponse(data);
    } catch (err) {
      setError('Backend not reachable. Please start the API server or try again later.');
      setCurrentStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuestion) {
      handleSubmit(lastQuestion);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center space-y-2">
        {/* <h1 className="font-display text-4xl font-bold tracking-tight text-gradient">Playground</h1>
        <p className="font-mono text-sm text-muted-foreground">
          Ask, choose a mode, and watch the agents debate in real-time.
        </p> */}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`group relative overflow-hidden rounded-xl border px-4 py-3 text-left transition-all hover:-translate-y-1 ${
              mode === m.id ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/70 ring-1 ring-border">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.hint}</p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 via-transparent to-accent/20" />
          </button>
        ))}
      </div>

      <div className="mb-4 text-xs text-muted-foreground font-mono">
        Mode hint: <span className="text-foreground">{modeHint}</span>
      </div>

      <QuestionForm onSubmit={handleSubmit} isLoading={isLoading} />

      {(isLoading || response || error) && (
        <div className="mt-8">
          <Timeline currentStep={currentStep} />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <ErrorBanner message={error} onRetry={handleRetry} />
        </div>
      )}

      {isLoading && (
        <div className="mt-6">
          <LoadingState />
        </div>
      )}

      {response && !isLoading && (
        <div className="mt-6 space-y-6">
          {/* Question display */}
          <div className="animate-fade-in rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">Question</span>
            </div>
            <p className="mt-2 text-sm">{response.question}</p>
          </div>

          {/* Agent cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <AgentCard
              agent={response.agent_a}
              label="A"
              isWinner={response.referee.chosen_agent === 'agent_a'}
              animationDelay="100ms"
            />
            <AgentCard
              agent={response.agent_b}
              label="B"
              isWinner={response.referee.chosen_agent === 'agent_b'}
              animationDelay="200ms"
            />
          </div>

          {/* Referee card */}
          <RefereeCard referee={response.referee} animationDelay="300ms" />

          {/* Final answer */}
          <FinalAnswerCard enhancedAnswer={response.enhanced_answer} animationDelay="400ms" />

          {/* Feedback */}
          <div className="flex justify-center pt-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <FeedbackButtons turnId={response.turn_id} />
          </div>
        </div>
      )}

      {!isLoading && !response && !error && (
        <div className="mt-16 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            Ask a question to start the multi-agent debate.
          </p>
        </div>
      )}
    </div>
  );
}
