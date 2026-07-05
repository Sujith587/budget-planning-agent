import React from 'react';

/**
 * Single input for monthly take-home income.
 */
export default function IncomeInput({ income, onChange }) {
  return (
    <div className="income-row">
      <label>Monthly income (after tax)</label>
      <input
        type="number"
        placeholder="0"
        value={income}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
    </div>
  );
}
