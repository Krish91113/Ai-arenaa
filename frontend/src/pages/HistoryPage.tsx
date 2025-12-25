import { useEffect, useState } from 'react';
import { getHistory } from '@/lib/api';
import { HistoryItem } from '@/types/api';
import { HistoryItemCard } from '@/components/HistoryItem';
import { ErrorBanner } from '@/components/ErrorBanner';
import { Loader2, History } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history. Backend may not be running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-mono text-2xl font-bold tracking-tight">History</h1>
        <p className="font-mono text-sm text-muted-foreground">
          Browse past multi-agent debates
        </p>
      </div>

      {error && (
        <ErrorBanner message={error} onRetry={fetchHistory} />
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && !error && history.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border">
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            No history yet. Start by asking a question in the Playground.
          </p>
        </div>
      )}

      {!isLoading && !error && history.length > 0 && (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={item.turn_id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HistoryItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
