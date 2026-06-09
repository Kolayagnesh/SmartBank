package smartBank.payment.dto;

import lombok.Data;
import smartBank.account.dto.CreateAccountRequest;

@Data
public class VerifyPaymentRequest {

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private CreateAccountRequest accountRequest;
}