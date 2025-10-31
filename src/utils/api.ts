import { projectId, publicAnonKey } from './supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-afdc9282`;

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}

export const api = {
  // AI Chat
  chat: (messages: Array<{ role: string; content: string }>) =>
    fetchApi('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  // Code Actions
  formatCode: (code: string, language: string) =>
    fetchApi('/code/format', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),

  debugCode: (code: string, language: string) =>
    fetchApi('/code/debug', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),

  reviewCode: (code: string, language: string) =>
    fetchApi('/code/review', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),

  generateCode: (description: string, language: string) =>
    fetchApi('/code/generate', {
      method: 'POST',
      body: JSON.stringify({ description, language }),
    }),

  optimizeCode: (code: string, language: string) =>
    fetchApi('/code/optimize', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),

  documentCode: (code: string, language: string) =>
    fetchApi('/code/document', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    }),

  // Snippets
  getSnippets: () => fetchApi('/snippets'),

  saveSnippet: (snippet: any) =>
    fetchApi('/snippets', {
      method: 'POST',
      body: JSON.stringify(snippet),
    }),

  deleteSnippet: (id: string) =>
    fetchApi(`/snippets/${id}`, {
      method: 'DELETE',
    }),

  // Stats
  getStats: () => fetchApi('/stats'),

  incrementStat: (field: string, value: number) =>
    fetchApi('/stats/increment', {
      method: 'POST',
      body: JSON.stringify({ field, value }),
    }),
};
