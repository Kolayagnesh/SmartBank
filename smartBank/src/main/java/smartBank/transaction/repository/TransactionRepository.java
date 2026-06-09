package smartBank.transaction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import smartBank.account.entity.Account;
import smartBank.transaction.entity.Transaction;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceAccount(Account account);
    @Query("""
SELECT t
FROM Transaction t
WHERE t.sourceAccount.user.id = :userId
   OR t.destinationAccount.user.id = :userId
ORDER BY t.transactionTime DESC
""")
    List<Transaction> findRecentTransactionsByUser(
            @Param("userId") Long userId);
    List<Transaction> findByDestinationAccount(Account account);
    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.sourceAccount = :account
               OR t.destinationAccount = :account
            ORDER BY t.transactionTime DESC
            """)
    List<Transaction> findAccountTransactions(
            Account account);
}