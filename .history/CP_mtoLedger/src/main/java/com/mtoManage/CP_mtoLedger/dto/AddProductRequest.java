import java.math.BigDecimal;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProductRequest {
    private Integer productId;
    private BigDecimal commission ;
}
