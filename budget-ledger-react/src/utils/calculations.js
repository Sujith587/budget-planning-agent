/**
 * Pure calculation helpers for the budget. Kept separate from components
 * so they're easy to unit test and reuse (e.g. when building the payload
 * sent to the backend for AI analysis).
 */

export function sumItems(items) {
  return items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
}

export function calculateBudget({ income, fixedItems, variableItems, savingsGoal, debtGoal }) {
  const fixed = sumItems(fixedItems);
  const variable = sumItems(variableItems);
  const goals = (Number(savingsGoal) || 0) + (Number(debtGoal) || 0);
  const incomeNum = Number(income) || 0;
  const remaining = incomeNum - fixed - variable - goals;

  return { income: incomeNum, fixed, variable, goals, remaining };
}
