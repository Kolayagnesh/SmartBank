package smartBank.transaction.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import smartBank.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class TransactionResponse {

    private String transactionReference;

    private TransactionType transactionType;

    private BigDecimal amount;

    private String sourceAccountNumber;

    private String destinationAccountNumber;

    private LocalDateTime transactionTime;
}