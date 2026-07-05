package com.budgetledger.backend.controller;

import com.budgetledger.backend.dto.BudgetAnalysisRequest;
import com.budgetledger.backend.model.AIRecommendation;
import com.budgetledger.backend.model.BudgetEntry;
import com.budgetledger.backend.repository.BudgetRepository;
import com.budgetledger.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final GeminiService geminiService;

    public BudgetController(BudgetRepository budgetRepository, GeminiService geminiService) {
        this.budgetRepository = budgetRepository;
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AIRecommendation> analyzeBudget(@RequestBody BudgetAnalysisRequest request) {
        AIRecommendation recommendation = geminiService.analyzeBudget(request);
        return ResponseEntity.ok(recommendation);
    }

    @PostMapping("/save")
    public ResponseEntity<BudgetEntry> saveBudget(@RequestBody BudgetEntry budgetEntry) {
        // Calculate total expenses
        double totalFixed = budgetEntry.getFixedExpenses() != null 
            ? budgetEntry.getFixedExpenses().stream().mapToDouble(Expense::getAmount).sum() 
            : 0.0;
        double totalVariable = budgetEntry.getVariableExpenses() != null 
            ? budgetEntry.getVariableExpenses().stream().mapToDouble(Expense::getAmount).sum() 
            : 0.0;
        budgetEntry.setTotalExpenses(totalFixed + totalVariable);
        
        BudgetEntry saved = budgetRepository.save(budgetEntry);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<BudgetEntry>> getHistory() {
        List<BudgetEntry> history = budgetRepository.findAll();
        // Sort entries in-memory by creation date descending (newest first)
        history.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistoryEntry(@PathVariable String id) {
        budgetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
