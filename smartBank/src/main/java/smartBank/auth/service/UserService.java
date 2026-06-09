package smartBank.auth.service;
import smartBank.auth.dto.*;
import smartBank.exception.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import smartBank.auth.entity.Role;
import smartBank.auth.entity.User;
import smartBank.auth.jwt.JwtService;
import smartBank.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartBank.notification.service.EmailService;

import java.time.LocalDateTime;
import java.util.Optional;

@Service

public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    public UserService(
            JwtService jwtService, UserRepository userRepository,
            EmailService emailService,
            BCryptPasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;

        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "SmartBank Password Reset OTP",
                """
                Your password reset OTP is: %s
    
                This OTP expires in 5 minutes.
                """
                        .formatted(otp)
        );
    }
    public UserResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already exists");
        }

        String otp = String.valueOf(
                100000 + new java.util.Random().nextInt(900000)
        );

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(
                        request.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(false)
                .otp(otp)
                .otpExpiry(
                        LocalDateTime.now().plusMinutes(5)
                )
                .build();

        User savedUser = userRepository.save(user);

        emailService.sendEmail(
                savedUser.getEmail(),
                "SmartBank Email Verification",
                """
                Welcome to SmartBank.
    
                Your OTP is: %s
    
                This OTP is valid for 5 minutes.
                """
                        .formatted(otp)
        );

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

        if (!user.isEnabled()) {
            throw new AccountNotVerifiedException(
                    "Please verify your email first");
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
    public void verifyOtp(
            VerifyotpRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"));

        if (user.getOtp() == null ||
                !user.getOtp().equals(
                        request.getOtp())) {

            throw new InvalidOtpException(
                    "Invalid OTP");
        }

        if (user.getOtpExpiry() == null ||
                user.getOtpExpiry()
                        .isBefore(
                                LocalDateTime.now())) {

            throw new OtpExpiredException(
                    "OTP has expired");
        }

        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);
    }
    public void resendOtp(ResendotpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (user.isEnabled()) {
            throw new AccountAlreadyVerifiedException(
                    "Account already verified");
        }

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        userRepository.save(user);

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "SmartBank OTP Verification",
                    "Your SmartBank OTP is: " + otp +
                            "\n\nThis OTP will expire in 5 minutes."
            );
        } catch (Exception ex) {
            throw new RuntimeException(
                    "Failed to send OTP email");
        }
    }
    public String generateOtp(){
        return  String.valueOf(
                100000 + new java.util.Random().nextInt(900000));
    }
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        if (user.getOtp() == null ||
                !user.getOtp().equals(request.getOtp())) {

            throw new InvalidOtpException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("OTP expired");
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);
    }
}