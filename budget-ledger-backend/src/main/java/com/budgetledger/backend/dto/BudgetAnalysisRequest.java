package com.budgetledger.backend.dto;

import com.budgetledger.backend.model.Expense;
import java.util.List;

public class BudgetAnalysisRequest {
    private double income;
    private List<Expense> fixedExpenses;
    private List<Expense> variableExpenses;
    private double savingsGoal;
    private double debtGoal;

    public BudgetAnalysisRequest() {}

    public double getIncome() { return income; }
    public void setIncome(double income) { this.income = income; }

    public List<Expense> getFixedExpenses() { return fixedExpenses; }
    public void setFixedExpenses(List<Expense> fixedExpenses) { this.fixedExpenses = fixedExpenses; }

    public List<Expense> getVariableExpenses() { return variableExpenses; }
    public void setVariableExpenses(List<Expense> variableExpenses) { this.variableExpenses = variableExpenses; }

    public double getSavingsGoal() { return savingsGoal; }
    public void setSavingsGoal(double savingsGoal) { this.savingsGoal = savingsGoal; }

    public double getDebtGoal() { return debtGoal; }
    public void setDebtGoal(double debtGoal) { this.debtGoal = debtGoal; }
}
