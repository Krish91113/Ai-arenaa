export interface AgentResult {
  model: string;
  answer: string;
  reasoning: string;
  raw_output: string;
}

export interface RefereeScores {
  correctness: number;
  clarity: number;
  usefulness: number;
}

export interface RefereeResult {
  model: string;
  chosen_agent: 'agent_a' | 'agent_b';
  scores: RefereeScores;
  critique: string;
  raw_output: string;
}

export interface EnhancedAnswer {
  model: string;
  answer: string;
}

export interface AskResponse {
  turn_id: number;
  question: string;
  agent_a: AgentResult;
  agent_b: AgentResult;
  referee: RefereeResult;
  enhanced_answer: EnhancedAnswer;
}

export interface HistoryItem {
  turn_id: number;
  question: string;
  chosen_agent: 'agent_a' | 'agent_b';
  enhanced_answer: string;
  referee: {
    scores: RefereeScores;
    critique: string;
    chosen_agent: 'agent_a' | 'agent_b';
  };
  created_at: string;
  human_label: 'good' | 'bad' | null;
}

export type FeedbackLabel = 'good' | 'bad';
