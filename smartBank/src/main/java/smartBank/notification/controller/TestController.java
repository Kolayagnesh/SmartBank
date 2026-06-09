package smartBank.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smartBank.notification.service.EmailService;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final EmailService emailService;

    @GetMapping("/email")
    public String testEmail() {

        emailService.sendEmail(
                "konerusrinanditha24@gmail.com",
                "SmartBank Test",
                "Email service is working!");

        return "Email sent";
    }
}