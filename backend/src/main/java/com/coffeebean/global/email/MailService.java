package com.coffeebean.global.email;

import com.coffeebean.global.exception.ServiceException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    // 메일 전송
    public void sendMail(String email, String subject, String content){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new ServiceException("500-1", "메일 전송 중 오류가 발생했습니다."); // 메일 전송 실패
        } catch (IllegalArgumentException e) {
            throw new ServiceException("400-1", "잘못된 이메일 주소 형식입니다."); // 이메일 주소 오류
        } catch (Exception e) {
            throw new ServiceException("502-1", "SMTP 서버와 연결할 수 없습니다."); // SMTP 서버 연결 실패
        }
    }
}
