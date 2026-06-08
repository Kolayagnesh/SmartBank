package smartBank.transaction.service;

import smartBank.transaction.dto.TransactionResponse;
import smartBank.transaction.dto.TransferRequest;
import smartBank.transaction.dto.TransferResponse;

import java.util.List;

public interface TransactionService {

    TransferResponse transfer(
            TransferRequest request);
    List<TransactionResponse>
    getAccountTransactions(
            String accountNumber);

}