package smartBank.exception;

import smartBank.auth.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(
            InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse>
    handleInvalidCredentials(
            InvalidCredentialsException ex) {

        return ResponseEntity.status(
                        HttpStatus.UNAUTHORIZED)
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                401,
                                ex.getMessage()
                        )
                );
    }
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExists(
            EmailAlreadyExistsException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        400,
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        404,
                        ex.getMessage()
                ));
    }
}