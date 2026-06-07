package smartBank.auth.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import smartBank.auth.dto.LoginResponse;
import smartBank.auth.dto.RegisterRequest;
import smartBank.auth.entity.Role;
import smartBank.auth.entity.User;
import smartBank.auth.jwt.JwtService;
import smartBank.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartBank.auth.dto.UserResponse;
import smartBank.auth.dto.LoginRequest;
import smartBank.exception.EmailAlreadyExistsException;
import smartBank.exception.InvalidCredentialsException;
import smartBank.exception.UserNotFoundException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    public UserResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already exists");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(
                        request.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
    public LoginResponse login(
            LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"));

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        if (!matches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password");
        }
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );
        return LoginResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .build();
    }
    public UserResponse getUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}