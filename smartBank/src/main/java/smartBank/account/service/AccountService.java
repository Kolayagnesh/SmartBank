package smartBank.account.service;

import smartBank.account.dto.AccountResponse;
import smartBank.account.dto.CreateAccountRequest;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(
            CreateAccountRequest request);

    List<AccountResponse> getMyAccounts();

    AccountResponse getMyAccount(
            String accountNumber);
}