package smartBank.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import smartBank.account.entity.Account;
import smartBank.account.repository.AccountRepository;
import smartBank.ai.dto.FinancialAnalysisResponse;
import smartBank.ai.dto.GroqResponse;
import smartBank.auth.entity.User;
import smartBank.auth.repository.UserRepository;
import smartBank.transaction.entity.Transaction;
import smartBank.transaction.repository.TransactionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;


    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";
    private final ObjectMapper objectMapper = new ObjectMapper();
    public FinancialAnalysisResponse analyze() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Account> accounts =
                accountRepository.findByUser(user);

        List<Transaction> transactions =
                transactionRepository.findBySourceAccountIn(accounts);

        long numberOfAccounts = accounts.size();

        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncoming = transactions.stream()
                .filter(t -> "CREDIT".equalsIgnoreCase(
                        String.valueOf(t.getTransactionType())))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOutgoing = transactions.stream()
                .filter(t -> "DEBIT".equalsIgnoreCase(
                        String.valueOf(t.getTransactionType())))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageTransaction =
                transactions.isEmpty()
                        ? BigDecimal.ZERO
                        : totalIncoming.add(totalOutgoing)
                        .divide(
                                BigDecimal.valueOf(transactions.size()),
                                2,
                                RoundingMode.HALF_UP
                        );

        long transactionCount = transactions.size();

        int accountAgeMonths = 0;

        if (!accounts.isEmpty()) {

            LocalDate oldestDate = accounts.stream()
                    .map(Account::getCreatedAt)
                    .filter(java.util.Objects::nonNull)
                    .map(dt -> dt.toLocalDate())
                    .min(LocalDate::compareTo)
                    .orElse(LocalDate.now());

            Period period =
                    Period.between(oldestDate, LocalDate.now());

            accountAgeMonths =
                    period.getYears() * 12 +
                            period.getMonths();
        }

        String prompt = """
                You are SmartBank AI Financial Advisor.
                advise the user based on their bank balance like
                if balance is high suggest them some tips to multiply the money like investment or fixed deposit
                if balance is less then suggest them how to earn money by some tips like small business ideas and all
                Analyze the customer's overall financial profile.

                Number Of Accounts: %s
                Total Balance Across Accounts: ₹%s
                Account Age: %s months
                Total Incoming: ₹%s
                Total Outgoing: ₹%s
                Average Transaction: ₹%s
                Transaction Count: %s

                Provide:

                1. Financial Health Score
                2. Risk Level
                3. Financial Summary
                4. Strengths
                5. Weaknesses
                6. Savings Recommendations
                7. Investment Ideas

                Return ONLY valid JSON.

                {
                  "financialHealthScore": 0,
                  "riskLevel": "",
                  "summary": "",
                  "strengths": [],
                  "weaknesses": [],
                  "recommendations": [],
                  "investmentIdeas": []
                }
                """
                .formatted(
                        numberOfAccounts,
                        totalBalance,
                        accountAgeMonths,
                        totalIncoming,
                        totalOutgoing,
                        averageTransaction,
                        transactionCount
                );

        return callGroq(prompt);
    }

    private FinancialAnalysisResponse callGroq(String prompt) {

        try {

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(groqApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            String requestBody = """
                    {
                      "model":"llama-3.3-70b-versatile",
                      "temperature":0.3,
                      "messages":[
                        {
                          "role":"user",
                          "content":%s
                        }
                      ]
                    }
                    """
                    .formatted(
                            objectMapper.writeValueAsString(prompt)
                    );

            HttpEntity<String> entity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            GROQ_URL,
                            HttpMethod.POST,
                            entity,
                            String.class
                    );


            GroqResponse groqResponse =
                    objectMapper.readValue(
                            response.getBody(),
                            GroqResponse.class
                    );

            String aiJson =
                    groqResponse.getChoices()
                            .get(0)
                            .getMessage()
                            .getContent();

            aiJson = aiJson
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            System.out.println("AI JSON:");
            System.out.println(aiJson);

            return objectMapper.readValue(
                    aiJson,
                    FinancialAnalysisResponse.class
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Groq Analysis Failed",
                    e
            );
        }
    }
}