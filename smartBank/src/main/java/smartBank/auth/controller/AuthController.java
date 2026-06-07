package smartBank.auth.controller;

import smartBank.auth.dto.LoginRequest;
import smartBank.auth.dto.LoginResponse;
import smartBank.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    @PostMapping("/login")
    public LoginResponse login(
            @Valid
            @RequestBody
            LoginRequest request) {
        return userService.login(request);
    }
}