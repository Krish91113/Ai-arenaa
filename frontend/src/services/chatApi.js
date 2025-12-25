import React from 'react';
  
  const ChatApi = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default ChatApi;
  import React from 'react';
  
  const ChatApi = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default ChatApi;

export async function sendChatMessage(prompt) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
  const res = await fetch(`${baseUrl}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: prompt }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }
  return res.json();
}
  