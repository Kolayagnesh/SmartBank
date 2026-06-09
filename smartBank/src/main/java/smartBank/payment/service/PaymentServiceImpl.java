package smartBank.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import smartBank.account.dto.AccountResponse;
import smartBank.account.service.AccountService;
import smartBank.payment.dto.CreateOrderRequest;
import smartBank.payment.dto.VerifyPaymentRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final AccountService accountService;

    @Override
    public JSONObject createOrder(
            CreateOrderRequest request
    ) throws Exception {

        RazorpayClient razorpay =
                new RazorpayClient(
                        keyId,
                        keySecret
                );

        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                request.getAmount()
                        .multiply(java.math.BigDecimal.valueOf(100))
                        .intValue()
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "receipt_" + System.currentTimeMillis()
        );

        Order order =
                razorpay.orders.create(orderRequest);

        return new JSONObject(order.toString());
    }

    @Override
    public boolean verifyPayment(
            VerifyPaymentRequest request
    ) {

        try {

            String payload =
                    request.getRazorpayOrderId()
                            + "|"
                            + request.getRazorpayPaymentId();

            String generatedSignature =
                    hmacSHA256(
                            payload,
                            keySecret
                    );

            return generatedSignature.equals(
                    request.getRazorpaySignature()
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Payment verification failed",
                    e
            );
        }
    }

    @Override
    public AccountResponse verifyAndCreateAccount(
            VerifyPaymentRequest request
    ) {

        boolean verified =
                verifyPayment(request);

        if (!verified) {
            throw new RuntimeException(
                    "Payment verification failed"
            );
        }

        return accountService.createAccount(
                request.getAccountRequest()
        );
    }

    private String hmacSHA256(
            String data,
            String secret
    ) throws Exception {

        Mac sha256Hmac =
                Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey =
                new SecretKeySpec(
                        secret.getBytes(StandardCharsets.UTF_8),
                        "HmacSHA256"
                );

        sha256Hmac.init(secretKey);

        byte[] hash =
                sha256Hmac.doFinal(
                        data.getBytes(StandardCharsets.UTF_8)
                );

        StringBuilder hexString =
                new StringBuilder();

        for (byte b : hash) {
            hexString.append(
                    String.format("%02x", b)
            );
        }

        return hexString.toString();
    }
}