package smartBank.payment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderRequest {
    private BigDecimal amount;
}