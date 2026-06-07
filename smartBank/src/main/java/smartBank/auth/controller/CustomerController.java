package smartBank.auth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public String profile() {
        return "Customer Profile";
    }
    @GetMapping("/debug")
    public Object debug(Authentication authentication) {
        return authentication.getAuthorities();
    }
}