package smartBank.auth.controller;

import org.springframework.http.ResponseEntity;
import smartBank.auth.dto.LoginRequest;
import smartBank.auth.dto.LoginResponse;
import smartBank.auth.dto.VerifyotpRequest;
import smartBank.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyotpRequest request) {

        userService.verifyOtp(request);

        return ResponseEntity.ok(
                "Email verified successfully");
    }
    private final UserService userService;
    @PostMapping("/login")
    public LoginResponse login(
            @Valid
            @RequestBody
            LoginRequest request) {
        return userService.login(request);
    }
}