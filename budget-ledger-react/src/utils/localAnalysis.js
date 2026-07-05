/**
 * Local AI-style budget analysis engine.
 * Generates structured financial advice from budget data — no backend required.
 */

export function analyzeLocally(payload) {
  const { income, fixedExpenses, variableExpenses, savingsGoal, debtGoal } = payload;

  const totalFixed = fixedExpenses.reduce((s, e) => s + e.amount, 0);
  const totalVariable = variableExpenses.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = totalFixed + totalVariable;
  const totalGoals = savingsGoal + debtGoal;
  const remaining = income - totalExpenses - totalGoals;
  const savingsRate = income > 0 ? ((totalGoals + Math.max(remaining, 0)) / income) * 100 : 0;
  const expenseRatio = income > 0 ? (totalExpenses / income) * 100 : 0;

  // ── Financial Health Score (0–10) ─────────────────────────────────────────
  let score = 5;
  if (savingsRate >= 20) score += 2;
  else if (savingsRate >= 10) score += 1;
  else if (savingsRate < 5) score -= 1;

  if (expenseRatio <= 50) score += 2;
  else if (expenseRatio <= 70) score += 1;
  else if (expenseRatio >= 90) score -= 2;

  if (debtGoal > 0) score += 0.5;
  if (remaining < 0) score -= 3;

  const financialHealthScore = Math.min(10, Math.max(1, Math.round(score)));

  // ── Budget Summary ────────────────────────────────────────────────────────
  const budgetSummary =
    income === 0
      ? 'No income entered yet. Please fill in your monthly income to get a full analysis.'
      : remaining >= 0
      ? `Your monthly income is ₹${income.toLocaleString('en-IN')}. After expenses of ₹${totalExpenses.toLocaleString('en-IN')} and goal contributions of ₹${totalGoals.toLocaleString('en-IN')}, you have ₹${remaining.toLocaleString('en-IN')} left over each month — a ${savingsRate.toFixed(1)}% effective savings rate.`
      : `Your monthly income is ₹${income.toLocaleString('en-IN')}, but your expenses (₹${totalExpenses.toLocaleString('en-IN')}) and goals (₹${totalGoals.toLocaleString('en-IN')}) exceed it by ₹${Math.abs(remaining).toLocaleString('en-IN')}. Immediate adjustments are needed.`;

  // ── Spending Analysis ─────────────────────────────────────────────────────
  let spendingAnalysis = '';
  if (income > 0) {
    const fixedPct = ((totalFixed / income) * 100).toFixed(1);
    const varPct = ((totalVariable / income) * 100).toFixed(1);

    spendingAnalysis = `Fixed expenses consume ${fixedPct}% of your income (₹${totalFixed.toLocaleString('en-IN')}), while variable expenses take ${varPct}% (₹${totalVariable.toLocaleString('en-IN')}). `;

    if (expenseRatio > 80)
      spendingAnalysis += 'This is quite high — very little room for savings or unexpected costs.';
    else if (expenseRatio > 60)
      spendingAnalysis += 'This leaves moderate room for savings, but tightening variable costs could help significantly.';
    else
      spendingAnalysis += 'This is a healthy expense ratio, giving you good flexibility for savings and goals.';
  }

  // ── Savings Tips ─────────────────────────────────────────────────────────
  const savingsTips = [];
  if (savingsGoal === 0)
    savingsTips.push('Set a dedicated savings goal — even ₹500/month builds financial resilience over time.');
  if (savingsRate < 10 && income > 0)
    savingsTips.push(`Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You're currently saving ~${savingsRate.toFixed(1)}% — closing the gap is your #1 priority.`);
  if (remaining > 200)
    savingsTips.push(`You have ₹${remaining.toLocaleString('en-IN')} unallocated each month — consider automating transfers to savings so it doesn't get spent accidentally.`);
  if (remaining > 0 && savingsGoal === 0)
    savingsTips.push('Automate your savings: set up an auto-transfer on payday so you save before you spend.');
  savingsTips.push('Keep 3–6 months of expenses (₹' + (totalExpenses * 3).toLocaleString('en-IN') + '–₹' + (totalExpenses * 6).toLocaleString('en-IN') + ') as an emergency fund target.');

  // ── Expense Reduction Tips ────────────────────────────────────────────────
  const expenseReductionTips = [];
  const bigVariable = variableExpenses.filter((e) => e.amount > income * 0.1);
  bigVariable.forEach((e) =>
    expenseReductionTips.push(`"${e.name}" (₹${e.amount.toLocaleString('en-IN')}) is over 10% of your income — look for ways to reduce it by 10–20%.`)
  );
  if (totalVariable > totalFixed * 0.6)
    expenseReductionTips.push('Your variable expenses are high relative to fixed costs. Tracking daily spending for 2 weeks often reveals 15–20% you can painlessly cut.');
  expenseReductionTips.push('Review subscriptions monthly — unused services are one of the easiest expense cuts.');
  if (expenseReductionTips.length === 1)
    expenseReductionTips.push('Your expense levels look reasonable. Focus on maintaining this balance as income grows.');

  // ── Emergency Fund Advice ─────────────────────────────────────────────────
  const monthlyTarget = totalExpenses * 3;
  const emergencyFundAdvice =
    `A 3-month emergency fund for your expense level is ₹${monthlyTarget.toLocaleString('en-IN')}. ` +
    (remaining >= 100
      ? `With your current ₹${remaining.toLocaleString('en-IN')} monthly surplus, you could build this in ${Math.ceil(monthlyTarget / remaining)} months.`
      : 'Focus on reducing expenses first to create a monthly surplus you can put toward this fund.');

  // ── Final Recommendation ──────────────────────────────────────────────────
  let finalRecommendation = '';
  if (remaining < 0) {
    finalRecommendation = `Your budget is currently in deficit by ₹${Math.abs(remaining).toLocaleString('en-IN')}/month. Prioritize cutting the largest variable expenses immediately, and review fixed costs for any renegotiable items (insurance, subscriptions, etc.).`;
  } else if (financialHealthScore >= 8) {
    finalRecommendation = 'Excellent financial position! Consider putting your surplus into index funds or a high-yield savings account to accelerate wealth building.';
  } else if (financialHealthScore >= 6) {
    finalRecommendation = `Good foundation! Your next focus should be boosting your savings rate from ${savingsRate.toFixed(1)}% toward 20%. Small variable expense cuts compound significantly over time.`;
  } else {
    finalRecommendation = 'Your budget needs attention. Start by tracking every expense for one month, then identify the top 3 variable categories to reduce. Even ₹1,000/month in cuts makes a meaningful difference over a year.';
  }

  return {
    budgetSummary,
    spendingAnalysis,
    savingsTips,
    expenseReductionTips,
    emergencyFundAdvice,
    financialHealthScore,
    finalRecommendation,
  };
}
