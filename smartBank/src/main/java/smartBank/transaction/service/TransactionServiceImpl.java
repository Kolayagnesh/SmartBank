package smartBank.transaction.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import smartBank.account.entity.Account;
import smartBank.account.exception.AccountAccessDeniedException;
import smartBank.account.exception.AccountNotFoundException;
import smartBank.account.repository.AccountRepository;
import smartBank.auth.entity.User;
import smartBank.exception.UserNotFoundException;
import smartBank.auth.repository.UserRepository;
import smartBank.notification.service.EmailService;
import smartBank.transaction.dto.TransactionResponse;
import smartBank.transaction.dto.TransferRequest;
import smartBank.transaction.dto.TransferResponse;
import smartBank.transaction.entity.Transaction;
import smartBank.transaction.entity.TransactionType;
import smartBank.transaction.exception.InsufficientBalanceException;
import smartBank.transaction.exception.InvalidTransferException;
import smartBank.transaction.repository.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final EmailService emailService;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TransferResponse transfer(
            TransferRequest request) {

        User currentUser = getCurrentUser();

        Account sourceAccount = accountRepository
                .findByAccountNumber(
                        request.getFromAccountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Source account not found"));

        Account destinationAccount = accountRepository
                .findByAccountNumber(
                        request.getToAccountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Destination account not found"));

        // Verify ownership
        if (!sourceAccount.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new AccountAccessDeniedException(
                    "You can only transfer from your own account");
        }

        // Prevent transfer to same account
        if (sourceAccount.getAccountNumber()
                .equals(destinationAccount.getAccountNumber())) {

            throw new InvalidTransferException(
                    "Cannot transfer to the same account");
        }

        // Check balance
        if (sourceAccount.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient account balance");
        }

        // Debit sender
        sourceAccount.setBalance(
                sourceAccount.getBalance()
                        .subtract(request.getAmount())
        );

        // Credit receiver
        destinationAccount.setBalance(
                destinationAccount.getBalance()
                        .add(request.getAmount())
        );

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = new Transaction();

        transaction.setTransactionReference(
                generateTransactionReference());

        transaction.setAmount(
                request.getAmount());

        transaction.setTransactionType(
                TransactionType.TRANSFER);

        transaction.setTransactionTime(
                LocalDateTime.now());

        transaction.setSourceAccount(
                sourceAccount);

        transaction.setDestinationAccount(
                destinationAccount);

        transactionRepository.save(transaction);
        try {
            // Sender Email
            emailService.sendEmail(
                    currentUser.getEmail(),
                    "Money Debited Successfully",
                    """
                    Dear %s,
        
                    ₹%s has been debited from your account.
        
                    Reference: %s
        
                    From Account: %s
                    To Account: %s
        
                    Thank you for using SmartBank.
                    """
                            .formatted(
                                    currentUser.getName(),
                                    transaction.getAmount(),
                                    transaction.getTransactionReference(),
                                    sourceAccount.getAccountNumber(),
                                    destinationAccount.getAccountNumber()
                            )
            );

            // Receiver Email
            emailService.sendEmail(
                    destinationAccount.getUser().getEmail(),
                    "Money Credited Successfully",
                    """
                    Dear %s,
        
                    ₹%s has been credited to your account.
        
                    Reference: %s
        
                    From Account: %s
                    To Account: %s
        
                    Thank you for using SmartBank.
                    """
                            .formatted(
                                    destinationAccount.getUser().getName(),
                                    transaction.getAmount(),
                                    transaction.getTransactionReference(),
                                    sourceAccount.getAccountNumber(),
                                    destinationAccount.getAccountNumber()
                            )
            );

        } catch (Exception e) {
            System.out.println("Failed to send email notification");
        }
        return TransferResponse.builder()
                .transactionReference(
                        transaction.getTransactionReference())
                .fromAccountNumber(
                        sourceAccount.getAccountNumber())
                .toAccountNumber(
                        destinationAccount.getAccountNumber())
                .amount(request.getAmount())
                .message(
                        "Transfer completed successfully")
                .build();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"));
    }
    @Override
    public List<TransactionResponse> getAccountTransactions(
            String accountNumber) {
        User currentUser = getCurrentUser();

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found"));

        // Ownership validation
        if (!account.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new AccountAccessDeniedException(
                    "You are not authorized to view this account");
        }

        List<Transaction> transactions =
                transactionRepository
                        .findAccountTransactions(account);

        return transactions.stream()
                .map(this::mapToTransactionResponse)
                .toList();
        // implementation
    }
    private String generateTransactionReference() {

        return "TXN" + System.currentTimeMillis();
    }
    private TransactionResponse mapToTransactionResponse(
            Transaction transaction) {

        return TransactionResponse.builder()
                .transactionReference(
                        transaction.getTransactionReference())

                .transactionType(
                        transaction.getTransactionType())

                .amount(
                        transaction.getAmount())

                .sourceAccountNumber(
                        transaction.getSourceAccount() != null
                                ? transaction.getSourceAccount()
                                .getAccountNumber()
                                : null)

                .destinationAccountNumber(
                        transaction.getDestinationAccount() != null
                                ? transaction.getDestinationAccount()
                                .getAccountNumber()
                                : null)

                .transactionTime(
                        transaction.getTransactionTime())

                .build();
    }
}