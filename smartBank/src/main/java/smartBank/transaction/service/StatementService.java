package smartBank.transaction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import smartBank.account.entity.Account;
import smartBank.account.repository.AccountRepository;
import smartBank.transaction.entity.Transaction;
import smartBank.transaction.repository.TransactionRepository;
import smartBank.transaction.util.PdfGenerator;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatementService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public byte[] generateStatement(
            String accountNumber,
            LocalDate from,
            LocalDate to
    ) {

        if (from.isAfter(to)) {
            throw new RuntimeException("From date cannot be after To date");
        }

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        List<Transaction> transactions =
                transactionRepository.findStatementTransactions(
                        account,
                        from.atStartOfDay(),
                        to.atTime(23, 59, 59)
                );

        return PdfGenerator.generateStatement(
                account,
                transactions,
                from,
                to
        );
    }
}