// ... existing code ...
import express from 'express';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    // Call OpenRouter
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optionally include Referer / Title per OpenRouter guidelines
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const json = await response.json();

    // Normalize reply text from OpenRouter
    const reply =
      json?.choices?.[0]?.message?.content ??
      json?.choices?.[0]?.delta?.content ??
      '';

    return res.json({ reply });
  } catch (err) {
    console.error('OpenRouter error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
// ... existing code ...