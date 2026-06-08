package smartBank.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import smartBank.account.entity.AccountType;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateAccountRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Opening balance is required")
    @DecimalMin(
            value = "1000.00",
            message = "Minimum opening balance is ₹1000"
    )
    private BigDecimal openingBalance;
}