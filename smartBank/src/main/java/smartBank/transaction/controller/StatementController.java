package smartBank.transaction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import smartBank.transaction.service.StatementService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/statements")
@RequiredArgsConstructor
public class StatementController {

    private final StatementService statementService;

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadStatement(
            @RequestParam String accountId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
    ) {

        byte[] pdf = statementService.generateStatement(
                accountId,
                from,
                to
        );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=statement.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}