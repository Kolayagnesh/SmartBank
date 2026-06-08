package smartBank.transaction.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smartBank.transaction.dto.TransactionResponse;
import smartBank.transaction.dto.TransferRequest;
import smartBank.transaction.dto.TransferResponse;
import smartBank.transaction.service.TransactionService;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public TransferResponse transfer(
            @Valid
            @RequestBody
            TransferRequest request) {

        return transactionService.transfer(request);
    }
    @GetMapping("/account/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<TransactionResponse> getAccountTransactions(
            @PathVariable String accountNumber) {

        return transactionService
                .getAccountTransactions(accountNumber);
    }
}