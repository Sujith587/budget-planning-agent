package com.budgetledger.backend.model;

import java.util.List;

public class AIRecommendation {
    private String budgetSummary;
    private String spendingAnalysis;
    private List<String> savingsTips;
    private List<String> expenseReductionTips;
    private String emergencyFundAdvice;
    private Integer financialHealthScore;
    private String finalRecommendation;

    public AIRecommendation() {}

    public String getBudgetSummary() { return budgetSummary; }
    public void setBudgetSummary(String budgetSummary) { this.budgetSummary = budgetSummary; }

    public String getSpendingAnalysis() { return spendingAnalysis; }
    public void setSpendingAnalysis(String spendingAnalysis) { this.spendingAnalysis = spendingAnalysis; }

    public List<String> getSavingsTips() { return savingsTips; }
    public void setSavingsTips(List<String> savingsTips) { this.savingsTips = savingsTips; }

    public List<String> getExpenseReductionTips() { return expenseReductionTips; }
    public void setExpenseReductionTips(List<String> expenseReductionTips) { this.expenseReductionTips = expenseReductionTips; }

    public String getEmergencyFundAdvice() { return emergencyFundAdvice; }
    public void setEmergencyFundAdvice(String emergencyFundAdvice) { this.emergencyFundAdvice = emergencyFundAdvice; }

    public Integer getFinancialHealthScore() { return financialHealthScore; }
    public void setFinancialHealthScore(Integer financialHealthScore) { this.financialHealthScore = financialHealthScore; }

    public String getFinalRecommendation() { return finalRecommendation; }
    public void setFinalRecommendation(String finalRecommendation) { this.finalRecommendation = finalRecommendation; }
}
