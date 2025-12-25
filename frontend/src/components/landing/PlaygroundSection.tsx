import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
import { MessageSquare } from 'lucide-react';

export function PlaygroundSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

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
      setError('Backend not running. Start the API to see real responses.');
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
    <section id="playground" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Try the <span className="text-gradient">Playground</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask a question and watch multiple AI agents debate to find the best answer.
          </p>
        </motion.div>

        {/* Playground content */}
        <div className="max-w-4xl mx-auto">
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
              <div className="animate-fade-in rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Question</span>
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Ask a question to start the multi-agent debate.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}