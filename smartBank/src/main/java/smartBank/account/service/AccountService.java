package smartBank.account.service;

import smartBank.account.dto.AccountResponse;
import smartBank.account.dto.CreateAccountRequest;
import smartBank.account.dto.DashBoardResponse;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(
            CreateAccountRequest request);

    List<AccountResponse> getMyAccounts();
    DashBoardResponse getDashboard();
    AccountResponse getMyAccount(
            String accountNumber);
}