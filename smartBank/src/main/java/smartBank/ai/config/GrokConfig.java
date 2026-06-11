package smartBank.ai.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "groq")
public class GrokConfig {

    private String apiKey;
    private String apiUrl;
    private String model;
}