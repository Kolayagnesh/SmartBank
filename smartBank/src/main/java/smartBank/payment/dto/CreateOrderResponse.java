package smartBank.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CreateOrderResponse {

    private String orderId;
    private String key;
    private BigDecimal amount;
}