package smartBank.account.exception;

public class AccountAlreadyExistsException
        extends RuntimeException {

    public AccountAlreadyExistsException(
            String message) {
        super(message);
    }

}