import React from 'react';

/**
 * Savings goal + debt payoff goal inputs.
 */
export default function GoalSection({ savingsGoal, debtGoal, onSavingsChange, onDebtChange }) {
  return (
    <div className="section">
      <div className="section-head">
        <h2>Goals</h2>
      </div>
      <div className="goal-block">
        <div className="goal-card">
          <label>Savings / emergency fund target</label>
          <div className="amt-wrap">
            <input
              type="number"
              placeholder="0"
              value={savingsGoal}
              onChange={(e) => onSavingsChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>
        <div className="goal-card">
          <label>Debt payoff (extra beyond minimums)</label>
          <div className="amt-wrap">
            <input
              type="number"
              placeholder="0"
              value={debtGoal}
              onChange={(e) => onDebtChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
