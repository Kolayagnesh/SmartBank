package smartBank.auth.controller;

import smartBank.auth.dto.RegisterRequest;
import smartBank.auth.dto.UserResponse;
import smartBank.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class    UserController {

    private final UserService userService;
    @PostMapping("/register")
    public UserResponse register(
            @Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @GetMapping("/{id}")
    public UserResponse getUser(
            @PathVariable Long id) {

        return userService.getUser(id);
    }
}