import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditCurrentBalanceRequest {
    private BigDecimal correctionAmount;
    private BigDecimal newBalance;
    private String reason;
}