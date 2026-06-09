package smartBank.transaction.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StatementRequest {

    private LocalDate fromDate;

    private LocalDate toDate;
}