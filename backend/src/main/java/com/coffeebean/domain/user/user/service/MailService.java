package com.coffeebean.domain.user.user.service;

import com.coffeebean.global.exception.ServiceException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String SENDER_EMAIL;


    public MimeMessage createMail(String recipientEmail, String code) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setFrom(SENDER_EMAIL);
        message.setRecipients(MimeMessage.RecipientType.TO, recipientEmail);
        message.setSubject("이메일 인증");

        String body = "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f1f1f1; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'>" +
                "<h2 style='color: #4CAF50; font-size: 24px; text-align: center;'>인증을 위한 이메일 인증번호</h2>" +
                "<p style='font-size: 16px; color: #333;'>안녕하세요, <strong>회원님</strong>.</p>" +
                "<p style='font-size: 16px; color: #555;'>요청하신 인증 번호는 아래와 같습니다:</p>" +
                "<div style='text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0;'>" +
                "<h1 style='font-size: 36px; color: #4CAF50; font-weight: bold;'>" + code + "</h1>" +
                "<p style='font-size: 16px; color: #555;'>이 코드를 입력하여 이메일 인증을 완료하세요.</p>" +
                "</div>" +
                "<p style='font-size: 14px; color: #777;'>감사합니다!</p>" +
                "<footer style='font-size: 12px; color: #aaa; text-align: center;'>" +
                "<p>&copy; 2025 Your Company</p>" +
                "</footer>" +
                "</div>" +
                "</body>" +
                "</html>";

        message.setText(body, "UTF-8", "html");
        return message;
    }

    // 메일 발송 (인증 코드를 매개변수로 받아 이메일 전송)
    public void sendSimpleMessage(String recipientEmail, String code) throws MessagingException {
        MimeMessage message = createMail(recipientEmail, code);
        try {
            javaMailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("메일 발송 중 오류가 발생했습니다.");
        }
    }

    // 유저에게 메일 전송
    public void sendMailToUser(String email, String subject, String content){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new ServiceException("500-1", "메일 전송 중 오류가 발생했습니다."); // 메일 전송 실패
        } catch (IllegalArgumentException e) {
            throw new ServiceException("400-1", "잘못된 이메일 주소 형식입니다."); // 이메일 주소 오류
        } catch (Exception e) {
            throw new ServiceException("502-1", "SMTP 서버와 연결할 수 없습니다."); // SMTP 서버 연결 실패
        }
    }

}