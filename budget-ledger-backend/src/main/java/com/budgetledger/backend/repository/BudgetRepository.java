package com.budgetledger.backend.repository;

import com.budgetledger.backend.model.BudgetEntry;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class BudgetRepository {
    
    private final Map<String, BudgetEntry> storage = new ConcurrentHashMap<>();

    public BudgetEntry save(BudgetEntry budgetEntry) {
        if (budgetEntry.getId() == null || budgetEntry.getId().trim().isEmpty()) {
            budgetEntry.setId(UUID.randomUUID().toString());
        }
        storage.put(budgetEntry.getId(), budgetEntry);
        return budgetEntry;
    }

    public List<BudgetEntry> findAll() {
        return new ArrayList<>(storage.values());
    }

    public void deleteById(String id) {
        if (id != null) {
            storage.remove(id);
        }
    }
}
