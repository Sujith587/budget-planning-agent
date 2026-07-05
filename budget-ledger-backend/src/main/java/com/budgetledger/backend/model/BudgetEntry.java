package com.budgetledger.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "budgets")
public class BudgetEntry {
    @Id
    private String id;
    
    private double income;
    private List<Expense> fixedExpenses;
    private List<Expense> variableExpenses;
    private double savingsGoal;
    private double debtGoal;
    private double totalExpenses;
    private AIRecommendation aiRecommendation;
    private LocalDateTime createdAt;

    public BudgetEntry() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(double totalExpenses) { this.totalExpenses = totalExpenses; }

    public AIRecommendation getAiRecommendation() { return aiRecommendation; }
    public void setAiRecommendation(AIRecommendation aiRecommendation) { this.aiRecommendation = aiRecommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
