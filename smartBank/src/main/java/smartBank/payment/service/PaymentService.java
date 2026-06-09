package smartBank.payment.service;

import org.json.JSONObject;
import smartBank.account.dto.AccountResponse;
import smartBank.payment.dto.CreateOrderRequest;
import smartBank.payment.dto.VerifyPaymentRequest;

public interface PaymentService {

    JSONObject createOrder(
            CreateOrderRequest request
    ) throws Exception;

    boolean verifyPayment(
            VerifyPaymentRequest request
    );

    AccountResponse verifyAndCreateAccount(
            VerifyPaymentRequest request
    );
}