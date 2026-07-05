import React from 'react';

/**
 * Displays the AI-generated financial advice returned by the backend's
 * /api/budget/analyze endpoint (Spring Boot -> Gemini).
 *
 * props:
 *  - recommendation: parsed AI response object, or null
 *  - loading: boolean
 *  - error: string | null
 */
export default function AIRecommendation({ recommendation, loading, error }) {
  if (loading) {
    return (
      <div className="ai-card">
        <h2>AI Recommendation</h2>
        <div className="ai-loading">Analyzing your budget…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-card">
        <h2>AI Recommendation</h2>
        <div className="ai-error">Couldn't get a recommendation: {error}</div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="ai-card">
        <h2>AI Recommendation</h2>
        <div className="ai-empty">Click "Analyze Budget" to get personalized advice.</div>
      </div>
    );
  }

  const {
    budgetSummary,
    spendingAnalysis,
    savingsTips = [],
    expenseReductionTips = [],
    emergencyFundAdvice,
    financialHealthScore,
    finalRecommendation,
  } = recommendation;

  return (
    <div className="ai-card">
      <h2>
        AI Recommendation
        {typeof financialHealthScore !== 'undefined' && (
          <span className="ai-score">{financialHealthScore}/10</span>
        )}
      </h2>

      {budgetSummary && (
        <div className="ai-block">
          <h3>Budget Summary</h3>
          <p>{budgetSummary}</p>
        </div>
      )}

      {spendingAnalysis && (
        <div className="ai-block">
          <h3>Spending Analysis</h3>
          <p>{spendingAnalysis}</p>
        </div>
      )}

      {savingsTips.length > 0 && (
        <div className="ai-block">
          <h3>Savings Tips</h3>
          <ul>
            {savingsTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {expenseReductionTips.length > 0 && (
        <div className="ai-block">
          <h3>Expense Reduction Tips</h3>
          <ul>
            {expenseReductionTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {emergencyFundAdvice && (
        <div className="ai-block">
          <h3>Emergency Fund Advice</h3>
          <p>{emergencyFundAdvice}</p>
        </div>
      )}

      {finalRecommendation && (
        <div className="ai-block">
          <h3>Final Recommendation</h3>
          <p>{finalRecommendation}</p>
        </div>
      )}
    </div>
  );
}
