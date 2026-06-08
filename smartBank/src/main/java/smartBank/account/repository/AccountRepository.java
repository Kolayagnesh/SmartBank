package smartBank.account.repository;

import smartBank.account.entity.Account;
import smartBank.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository
        extends JpaRepository<Account, Long> {

    List<Account> findByUser(User user);

    Optional<Account> findByAccountNumber(String accountNumber);

}