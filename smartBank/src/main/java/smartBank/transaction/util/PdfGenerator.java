package smartBank.transaction.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import smartBank.account.entity.Account;
import smartBank.transaction.entity.Transaction;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public class PdfGenerator {

    public static byte[] generateStatement(
            Account account,
            List<Transaction> transactions,
            LocalDate from,
            LocalDate to
    ) {

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream content = new PDPageContentStream(document, page);

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);

            content.beginText();
            content.newLineAtOffset(50, 750);
            content.showText("SMART BANK STATEMENT");
            content.endText();

            content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

            int y = 720;

            writeLine(content, "Account Number : " + account.getAccountNumber(), y);
            y -= 20;

            writeLine(content, "Statement Period : " + from + " to " + to, y);
            y -= 40;

            writeLine(content,
                    String.format("%-15s %-15s %-15s",
                            "Date", "Type", "Amount"),
                    y);

            y -= 20;

            for (Transaction txn : transactions) {

                writeLine(content,
                        txn.getTransactionTime().toLocalDate()
                                + "   "
                                + txn.getTransactionType()
                                + "   "
                                + txn.getAmount(),
                        y);

                y -= 20;

                if (y < 50) {
                    break;
                }
            }

            y -= 20;

            writeLine(content,
                    "Current Balance : " + account.getBalance(),
                    y);

            content.close();

            document.save(outputStream);

            return outputStream.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private static void writeLine(
            PDPageContentStream content,
            String text,
            int y
    ) throws IOException {

        content.beginText();
        content.newLineAtOffset(50, y);
        content.showText(text);
        content.endText();
    }
}