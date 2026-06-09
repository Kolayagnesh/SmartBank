package smartBank.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyotpRequest {

    private String email;

    private String otp;
}