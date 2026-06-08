package smartBank.account.service;

import smartBank.account.dto.AccountResponse;
import smartBank.account.dto.CreateAccountRequest;
import smartBank.account.entity.Account;
import smartBank.account.exception.AccountAccessDeniedException;
import smartBank.account.exception.AccountNotFoundException;
import smartBank.account.repository.AccountRepository;
import smartBank.auth.entity.User;
import smartBank.exception.UserNotFoundException;
import smartBank.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import smartBank.transaction.entity.Transaction;
import smartBank.transaction.entity.TransactionType;
import smartBank.transaction.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {

        User user = getCurrentUser();

        Account account = new Account();

        account.setAccountNumber(generateAccountNumber());
        account.setBalance(request.getOpeningBalance());
        account.setAccountType(request.getAccountType());
        account.setUser(user);
        account.setCreatedAt(LocalDateTime.now());

        Account savedAccount = accountRepository.save(account);
        Transaction transaction = new Transaction();

        transaction.setTransactionReference(
                generateTransactionReference());

        transaction.setAmount(
                request.getOpeningBalance());

        transaction.setTransactionType(
                TransactionType.ACCOUNT_OPENING);

        transaction.setTransactionTime(
                LocalDateTime.now());

        transaction.setDestinationAccount(
                savedAccount);

        transactionRepository.save(transaction);
        return mapToResponse(savedAccount);
    }
    private String generateTransactionReference() {
        return "TXN" + System.currentTimeMillis();
    }
    @Override
    public List<AccountResponse> getMyAccounts() {

        User user = getCurrentUser();

        List<Account> accounts = accountRepository.findByUser(user);

        return accounts.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AccountResponse getMyAccount(String accountNumber) {
        User user = getCurrentUser();
        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccountAccessDeniedException(
                    "You are not authorized to access this account");
        }

        return mapToResponse(account);
    }
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }
    private String generateAccountNumber() {
        return "SB" + System.currentTimeMillis();
    }
    private AccountResponse mapToResponse(Account account) {

        AccountResponse response = new AccountResponse();

        response.setId(account.getId());
        response.setAccountNumber(account.getAccountNumber());
        response.setBalance(account.getBalance());
        response.setAccountType(account.getAccountType());

        return response;
    }
}