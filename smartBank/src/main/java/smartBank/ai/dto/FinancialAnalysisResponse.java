package smartBank.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAnalysisResponse {

    private Integer financialHealthScore;

    private String riskLevel;

    private String summary;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> recommendations;

    private List<String> investmentIdeas;
}