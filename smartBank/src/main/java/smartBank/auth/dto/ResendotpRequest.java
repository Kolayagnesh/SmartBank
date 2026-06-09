package smartBank.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ResendotpRequest {

    @NotBlank
    @Email
    private String email;

    public void setEmail(String email) {
        this.email = email;
    }
}