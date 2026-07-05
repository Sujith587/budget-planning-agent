import React from 'react';
import IncomeInput from './IncomeInput';
import ExpenseSection from './ExpenseSection';
import GoalSection from './GoalSection';
import AllocationChart from './AllocationChart';
import SummaryCard from './SummaryCard';
import { calculateBudget } from '../utils/calculations';

/**
 * The main budget-building form: income, fixed/variable expenses, goals,
 * live allocation chart + summary, and the "Analyze Budget" trigger.
 */
export default function BudgetForm({
  income,
  setIncome,
  fixedItems,
  setFixedItems,
  variableItems,
  setVariableItems,
  savingsGoal,
  setSavingsGoal,
  debtGoal,
  setDebtGoal,
  onAnalyze,
  analyzing,
}) {
  const { fixed, variable, goals, remaining } = calculateBudget({
    income,
    fixedItems,
    variableItems,
    savingsGoal,
    debtGoal,
  });

  return (
    <div>
      <p className="subtext">
        Fill in your numbers — everything updates live. Add or remove lines to match your actual
        accounts, then click "Analyze Budget" for personalized AI advice.
      </p>

      <IncomeInput income={income} onChange={setIncome} />

      <ExpenseSection title="Fixed Expenses" items={fixedItems} onChange={setFixedItems} />
      <ExpenseSection title="Variable Expenses" items={variableItems} onChange={setVariableItems} />

      <GoalSection
        savingsGoal={savingsGoal}
        debtGoal={debtGoal}
        onSavingsChange={setSavingsGoal}
        onDebtChange={setDebtGoal}
      />

      <div className="tape">
        <h2>Allocation</h2>
        <AllocationChart
          fixed={fixed}
          variable={variable}
          goals={goals}
          remaining={remaining}
          income={Number(income) || 0}
        />
      </div>

      <SummaryCard
        income={Number(income) || 0}
        fixed={fixed}
        variable={variable}
        goals={goals}
        remaining={remaining}
      />

      <button className="analyze-btn" onClick={onAnalyze} disabled={analyzing || !income}>
        {analyzing ? 'Analyzing…' : 'Analyze Budget'}
      </button>
    </div>
  );
}
