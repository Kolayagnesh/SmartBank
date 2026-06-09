package smartBank.payment.controller;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import smartBank.account.dto.AccountResponse;
import smartBank.payment.dto.CreateOrderRequest;
import smartBank.payment.dto.VerifyPaymentRequest;
import smartBank.payment.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public String createOrder(
            @RequestBody CreateOrderRequest request
    ) throws Exception {

        JSONObject order =
                paymentService.createOrder(request);

        return order.toString();
    }

    @PostMapping("/verify-account-opening")
    public AccountResponse verifyAndCreateAccount(
            @RequestBody VerifyPaymentRequest request
    ) {

        System.out.println(
                "VERIFY ENDPOINT HIT"
        );

        return paymentService
                .verifyAndCreateAccount(request);
    }
}