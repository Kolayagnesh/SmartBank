package smartBank.account.controller;

import smartBank.account.dto.AccountResponse;
import smartBank.account.dto.CreateAccountRequest;
import smartBank.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public AccountResponse createAccount(
            @Valid @RequestBody
            CreateAccountRequest request) {

        return accountService.createAccount(request);
    }
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<AccountResponse> getMyAccounts() {

        return accountService.getMyAccounts();
    }
    @GetMapping("/my/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public AccountResponse getMyAccount(
            @PathVariable String accountNumber) {
        return accountService
                .getMyAccount(accountNumber);
    }
}