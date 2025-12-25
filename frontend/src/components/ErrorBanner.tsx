import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ 
  message = 'Backend not reachable. Please start the API server or try again later.',
  onRetry 
}: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <span className="font-mono text-sm">{message}</span>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 font-mono"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
