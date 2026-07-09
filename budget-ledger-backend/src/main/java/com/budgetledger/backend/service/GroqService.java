package com.budgetledger.backend.service;

import com.budgetledger.backend.dto.BudgetAnalysisRequest;
import com.budgetledger.backend.model.AIRecommendation;
import com.budgetledger.backend.model.Expense;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GroqService {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.model:llama3-8b-8192}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GroqService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public AIRecommendation analyzeBudget(BudgetAnalysisRequest request) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("Groq API key is not configured. Please set the GROQ_API_KEY environment variable or configure it in application.properties.");
        }

        String url = "https://api.groq.com/openai/v1/chat/completions";

        String prompt = buildPrompt(request);

        // Build Request Body for Groq (OpenAI-compatible schema)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        requestBody.put("messages", Collections.singletonList(message));

        Map<String, Object> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            if (response == null || !response.containsKey("choices")) {
                throw new RuntimeException("Empty response from Groq API");
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No choices returned from Groq API");
            }

            Map<String, Object> choice = choices.get(0);
            Map<String, Object> messageMap = (Map<String, Object>) choice.get("message");
            String jsonText = (String) messageMap.get("content");

            // Parse response json into AIRecommendation object
            return objectMapper.readValue(jsonText, AIRecommendation.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate AI Recommendation: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(BudgetAnalysisRequest request) {
        return String.format(
            "You are a Budget Planning Agent specialized in creating personalized monthly budget plans for Indian earners.\n" +
            "\n" +
            "Your Core Task:\n" +
            "When a user provides their monthly income (and optionally their family size, city, financial goals, or specific constraints), create a detailed, realistic budget breakdown and explain your recommendations in clear, practical terms.\n" +
            "\n" +
            "Budget details provided:\n" +
            "- Monthly Income: \u20B9%.2f\n" +
            "- User-entered Fixed Expenses: %s\n" +
            "- User-entered Variable Expenses: %s\n" +
            "- Savings Goal: \u20B9%.2f\n" +
            "- Debt Payoff Goal: \u20B9%.2f\n" +
            "\n" +
            "Guidelines:\n" +
            "- Use realistic percentage allocations for India: typically 20-30%% for housing, 15-25%% for food (scaling with family size), 10-15%% for savings, 5-10%% for emergency fund.\n" +
            "- Always prioritize an emergency fund (\u20B92,000-\u20B95,000 depending on income).\n" +
            "- Adjust grocery budgets upward if family size is large.\n" +
            "- If a specific goal is mentioned, create a dedicated category and calculate how long it will take to achieve.\n" +
            "- Keep language practical and encouraging; avoid jargon.\n" +
            "- All figures should be in Indian Rupees (\u20B9).\n" +
            "- Don't create unrealistic budgets that ignore local cost of living.\n" +
            "- Don't recommend savings rates above 40%% of income for essential earners.\n" +
            "- Don't ignore stated family size or location when allocating funds.\n" +
            "\n" +
            "You MUST respond ONLY with a valid JSON object matching the requested schema. Do not wrap the JSON in markdown code blocks or backticks.\n" +
            "The JSON response MUST match the following structure exactly:\n" +
            "{\n" +
            "  \"budgetSummary\": \"(Insert the Budget Table and Your Explanation here. The Budget Table must show Rent/Housing, Groceries, Transportation, Utilities, Entertainment, Savings, Emergency Fund, and any goal-specific fund, with amounts summing to exactly the user's income. At the bottom, show the remaining balance. Following the table, insert a 2-3 sentence explanation referencing their specific income, justifying allocations, acknowledging family size/city/goals, and calculating target timeline if goals are present)\",\n" +
            "  \"spendingAnalysis\": \"(A concise analysis summarizing the spending categories, housing percentages, and food budgets relative to family size/location)\",\n" +
            "  \"savingsTips\": [\n" +
            "    \"(Practical tip 1 to optimize the budget and maximize savings potential)\",\n" +
            "    \"(Practical tip 2)\"\n" +
            "  ],\n" +
            "  \"expenseReductionTips\": [\n" +
            "    \"(Specific ideas to reduce expenses in high-cost categories or suggest local Indian cost alternatives)\",\n" +
            "    \"(Practical reduction tip 2)\"\n" +
            "  ],\n" +
            "  \"emergencyFundAdvice\": \"(Feasible monthly targets and timeline to accumulate a basic Indian emergency fund of \u20B92,000-\u20B95,000 depending on income)\",\n" +
            "  \"financialHealthScore\": (An integer score from 1 to 10 evaluating this Indian earner budget configuration),\n" +
            "  \"finalRecommendation\": \"(The final encouraging verdict and priority next steps)\"\n" +
            "}",
            request.getIncome(),
            formatExpenses(request.getFixedExpenses()),
            formatExpenses(request.getVariableExpenses()),
            request.getSavingsGoal(),
            request.getDebtGoal()
        );
    }

    private String formatExpenses(List<Expense> expenses) {
        if (expenses == null || expenses.isEmpty()) {
            return "None";
        }
        StringBuilder sb = new StringBuilder();
        for (Expense e : expenses) {
            sb.append(String.format("%s (\u20B9%.2f), ", e.getName(), e.getAmount()));
        }
        return sb.substring(0, sb.length() - 2);
    }
}
