import { AskResponse, HistoryItem, FeedbackLabel } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

export async function askQuestion(question: string): Promise<AskResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} - ${text}`);
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/conversations`);

  if (!response.ok) {
    // Gracefully degrade to an empty history if backend route is unavailable
    return [];
  }

  const conversations = await response.json();

  // Map backend metadata into the UI's history shape
  return conversations.map((conv: any, idx: number) => ({
    turn_id: idx,
    question: conv.title || 'Conversation',
    chosen_agent: 'agent_a',
    enhanced_answer: '',
    referee: {
      scores: { correctness: 0, clarity: 0, usefulness: 0 },
      critique: 'History details unavailable in this build.',
      chosen_agent: 'agent_a',
    },
    created_at: conv.created_at,
    human_label: null,
  }));
}

export async function submitLabel(turnId: number, label: FeedbackLabel): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ turn_id: turnId, label }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} - ${text}`);
  }
}
