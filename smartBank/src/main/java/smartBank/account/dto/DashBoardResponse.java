package smartBank.account.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import smartBank.transaction.dto.TransactionResponse;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class DashBoardResponse {

    private String name;

    private Integer totalAccounts;

    private BigDecimal totalBalance;

    private List<TransactionResponse> recentTransactions;
}