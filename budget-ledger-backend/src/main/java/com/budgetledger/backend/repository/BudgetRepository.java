package com.budgetledger.backend.repository;

import com.budgetledger.backend.model.BudgetEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends MongoRepository<BudgetEntry, String> {
}
