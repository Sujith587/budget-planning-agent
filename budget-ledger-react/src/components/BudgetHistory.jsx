import React, { useEffect, useState } from 'react';
import { getHistory, deleteHistoryEntry } from '../services/api';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

/**
 * Lists every previously analyzed & saved budget, pulled from
 * GET /api/budget/history. Supports deleting an entry and viewing
 * its stored AI recommendation.
 */
export default function BudgetHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert('Could not delete entry: ' + (err.message || 'unknown error'));
    }
  };

  if (loading) return <div className="ai-loading">Loading history…</div>;
  if (error) return <div className="ai-error">Couldn't load history: {error}</div>;
  if (entries.length === 0) {
    return <div className="ai-empty">No saved budgets yet. Analyze and save one from the Planner tab.</div>;
  }

  return (
    <div className="section">
      <div className="section-head">
        <h2>Budget History</h2>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Savings Goal</th>
            <th>AI Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <React.Fragment key={entry.id}>
              <tr>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>{fmt(entry.income)}</td>
                <td>{fmt(entry.totalExpenses)}</td>
                <td>{fmt(entry.savingsGoal)}</td>
                <td>
                  <span className="score-pill">{entry.aiRecommendation?.financialHealthScore ?? '—'}/10</span>
                </td>
                <td className="history-actions">
                  <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                    {expandedId === entry.id ? 'Hide' : 'View'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </button>
                </td>
              </tr>
              {expandedId === entry.id && (
                <tr>
                  <td colSpan={6}>
                    <div className="ai-block">
                      <h3>Final Recommendation</h3>
                      <p>{entry.aiRecommendation?.finalRecommendation || 'No recommendation stored.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
