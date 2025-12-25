import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getHistory } from '@/lib/api';
import { HistoryItem } from '@/types/api';
import { HistoryItemCard } from '@/components/HistoryItem';
import { ErrorBanner } from '@/components/ErrorBanner';
import { Loader2, History, Inbox } from 'lucide-react';

export function HistorySection() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('No history yet. Once the backend is live, you\'ll see all past multi-agent debates here.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <section id="history" className="py-24">
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
            History & <span className="text-gradient">Judgements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track all your past queries, see referee decisions, and review the debate outcomes.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                {error}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && !error && history.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                No history yet. Start by asking a question in the Playground.
              </p>
            </div>
          )}

          {!isLoading && !error && history.length > 0 && (
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.turn_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HistoryItemCard item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}