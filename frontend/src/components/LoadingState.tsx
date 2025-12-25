import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-6">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-mono text-sm">Agents are debating your question...</span>
      </div>

      {/* Skeleton cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse-subtle rounded-md bg-secondary" />
              <div className="space-y-1">
                <div className="h-4 w-20 animate-pulse-subtle rounded bg-secondary" />
                <div className="h-3 w-16 animate-pulse-subtle rounded bg-secondary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse-subtle rounded bg-secondary" />
              <div className="h-3 w-4/5 animate-pulse-subtle rounded bg-secondary" />
              <div className="h-3 w-3/5 animate-pulse-subtle rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse-subtle rounded-md bg-secondary" />
          <div className="space-y-1">
            <div className="h-4 w-16 animate-pulse-subtle rounded bg-secondary" />
            <div className="h-3 w-20 animate-pulse-subtle rounded bg-secondary" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-20 animate-pulse-subtle rounded bg-secondary" />
              <div className="h-1.5 w-full animate-pulse-subtle rounded-full bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
