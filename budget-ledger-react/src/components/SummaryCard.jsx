import React from 'react';

const fmt = (n) => {
  const sign = n < 0 ? '-' : '';
  return sign + '₹' + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

/**
 * Totals table plus the plain-language verdict about whether the
 * budget is balanced, over, or has room left over.
 */
export default function SummaryCard({ income, fixed, variable, goals, remaining }) {
  let verdictClass = 'ok';
  let verdictContent = null;

  if (income === 0) {
    verdictClass = 'warn';
    verdictContent = (
      <>
        <strong>Waiting on income</strong>
        Enter your monthly take-home pay above to see how things balance out.
      </>
    );
  } else if (remaining < 0) {
    verdictClass = 'over';
    verdictContent = (
      <>
        <strong>Over budget by {fmt(Math.abs(remaining))}</strong>
        Your expenses and goals add up to more than your income. Something has to give — trim
        variable spending, revisit a fixed cost, or scale back a goal amount for now.
      </>
    );
  } else if (remaining === 0) {
    verdictContent = (
      <>
        <strong>Fully allocated</strong>
        Every rupee has a job. If this feels too tight day-to-day, consider easing the goal
        amounts slightly to build in breathing room.
      </>
    );
  } else {
    verdictContent = (
      <>
        <strong>{fmt(remaining)} unallocated</strong>
        You could add it to savings, put it toward debt, build in a spending cushion, or leave it
        as a buffer — your call.
      </>
    );
  }

  return (
    <div className="tape">
      <h2>Summary</h2>
      <div className="totals">
        <div className="line">
          <span>Income</span>
          <span>{fmt(income)}</span>
        </div>
        <div className="line">
          <span>Fixed expenses</span>
          <span>{fmt(fixed)}</span>
        </div>
        <div className="line">
          <span>Variable expenses</span>
          <span>{fmt(variable)}</span>
        </div>
        <div className="line">
          <span>Goals (savings + debt)</span>
          <span>{fmt(goals)}</span>
        </div>
        <div className="line strong">
          <span>Unallocated</span>
          <span>{fmt(remaining)}</span>
        </div>
      </div>
      <div className={`verdict ${verdictClass}`}>{verdictContent}</div>
    </div>
  );
}
