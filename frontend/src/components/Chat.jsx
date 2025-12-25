import React, { useState } from 'react';
import { sendChatMessage } from '../services/chatApi';

// ... existing code ...

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReply('');

    try {
      const data = await sendChatMessage(prompt);
      // Expecting { reply: "..." } from backend
      setReply(data.reply ?? JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Chat</h2>
      <form onSubmit={onSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          style={{ width: '100%' }}
          placeholder="Type your prompt..."
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reply && (
        <div style={{ marginTop: 16 }}>
          <h3>Reply</h3>
          <pre>{reply}</pre>
        </div>
      )}
    </div>
  );
}

// ... existing code ...