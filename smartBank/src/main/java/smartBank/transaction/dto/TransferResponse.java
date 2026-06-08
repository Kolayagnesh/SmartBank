package smartBank.transaction.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class TransferResponse {

    private String transactionReference;

    private String fromAccountNumber;

    private String toAccountNumber;

    private BigDecimal amount;

    private String message;
}