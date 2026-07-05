import axios from 'axios';

// Vite proxies "/api" to the Spring Boot backend in dev (see vite.config.js).
// In production, set VITE_API_BASE_URL to the deployed backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

/**
 * Sends the current budget to the backend, which forwards it to Gemini
 * and returns structured financial advice.
 */
export async function analyzeBudget(payload) {
  const res = await api.post('/budget/analyze', payload);
  return res.data;
}

/**
 * Persists a budget (with its AI recommendation) to MongoDB.
 */
export async function saveBudget(payload) {
  const res = await api.post('/budget/save', payload);
  return res.data;
}

/**
 * Fetches all previously saved budgets.
 */
export async function getHistory() {
  const res = await api.get('/budget/history');
  return res.data;
}

/**
 * Deletes a saved budget by id.
 */
export async function deleteHistoryEntry(id) {
  const res = await api.delete(`/budget/history/${id}`);
  return res.data;
}

export default api;
