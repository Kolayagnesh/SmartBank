package smartBank.ai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smartBank.ai.dto.FinancialAnalysisResponse;
import smartBank.ai.service.AiAnalysisService;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService aiAnalysisService;

    @GetMapping("/account-analysis")
    public FinancialAnalysisResponse analyze() {
        return aiAnalysisService.analyze();
    }
}