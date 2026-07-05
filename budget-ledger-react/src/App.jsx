import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BudgetForm from './components/BudgetForm';
import AIRecommendation from './components/AIRecommendation';
import BudgetHistory from './components/BudgetHistory';
import { analyzeLocally } from './utils/localAnalysis';
import { calculateBudget } from './utils/calculations';
import { analyzeBudget, saveBudget } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('planner');

  // Budget state
  const [income, setIncome] = useState('');
  const [fixedItems, setFixedItems] = useState([
    { id: 1, name: 'Rent / mortgage', amount: '' },
    { id: 2, name: 'Insurance', amount: '' },
    { id: 3, name: 'Utilities', amount: '' },
  ]);
  const [variableItems, setVariableItems] = useState([
    { id: 1, name: 'Groceries', amount: '' },
    { id: 2, name: 'Transportation', amount: '' },
    { id: 3, name: 'Entertainment', amount: '' },
  ]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [debtGoal, setDebtGoal] = useState('');

  // AI state
  const [recommendation, setRecommendation] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setRecommendation(null);

    const payload = {
      income: Number(income) || 0,
      fixedExpenses: fixedItems
        .filter(item => item.name.trim() !== '' && item.amount !== '')
        .map(({ name, amount }) => ({ name, amount: Number(amount) || 0 })),
      variableExpenses: variableItems
        .filter(item => item.name.trim() !== '' && item.amount !== '')
        .map(({ name, amount }) => ({ name, amount: Number(amount) || 0 })),
      savingsGoal: Number(savingsGoal) || 0,
      debtGoal: Number(debtGoal) || 0,
    };

    try {
      // Call Spring Boot backend to analyze budget using Gemini
      const result = await analyzeBudget(payload);
      setRecommendation(result);

      // Save budget along with its recommendation to MongoDB
      try {
        await saveBudget({
          ...payload,
          aiRecommendation: result
        });
      } catch (saveErr) {
        console.warn('Failed to save budget history to backend database:', saveErr);
      }
    } catch (err) {
      console.warn('Backend analysis failed, falling back to local analysis:', err);
      // Fallback to local offline analysis
      try {
        const fallbackResult = analyzeLocally(payload);
        setRecommendation({
          ...fallbackResult,
          budgetSummary: '⚠️ [Offline Fallback] ' + fallbackResult.budgetSummary,
        });
      } catch (localErr) {
        setError(err.response?.data?.message || err.message || 'Something went wrong during analysis.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="sheet">
        {activeTab === 'planner' ? (
          <>
            <BudgetForm
              income={income}
              setIncome={setIncome}
              fixedItems={fixedItems}
              setFixedItems={setFixedItems}
              variableItems={variableItems}
              setVariableItems={setVariableItems}
              savingsGoal={savingsGoal}
              setSavingsGoal={setSavingsGoal}
              debtGoal={debtGoal}
              setDebtGoal={setDebtGoal}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
            />
            <AIRecommendation recommendation={recommendation} loading={analyzing} error={error} />
          </>
        ) : (
          <BudgetHistory />
        )}
      </div>
    </>
  );
}

