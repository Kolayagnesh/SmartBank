package smartBank.common;

import smartBank.auth.entity.Role;
import smartBank.auth.entity.User;
import smartBank.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {

        if (userRepository.count() == 0) {

            User admin = User.builder()
                    .name("Admin")
                    .email("admin@smartbank.com")
                    .password("admin123")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin user created");
        }
    }
}