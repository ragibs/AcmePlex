package com.acmeplex.acmeplex_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Service class to handle sending emails using JavaMailSender and Thymeleaf templates.
 * This service supports sending both regular emails and announcements with custom templates.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    /**
     * Sends an email to the specified recipient with the provided subject and content generated
     * from a Thymeleaf template.
     *
     * @param to the recipient's email address
     * @param subject the subject of the email
     * @param templateName the name of the Thymeleaf template to process
     * @param context the context to be used in the template (variables for dynamic content)
     * @throws MessagingException if there is an error creating or sending the email
     */
    public void sendEmail(String to, String subject, String templateName, Context context) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        String htmlContent = templateEngine.process(templateName, context);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    /**
     * Sends an email announcement to the specified recipient, using a custom template for the
     * announcement content. The announcement content is passed as a variable to the Thymeleaf template.
     *
     * @param email the recipient's email address
     * @param subject the subject of the email
     * @param announcement the content of the announcement to include in the email
     * @param templateName the name of the Thymeleaf template to process for the email content
     * @throws MessagingException if there is an error creating or sending the email
     */
    public void sendEmailForAnnouncement(String email, String subject, String announcement, String templateName) throws MessagingException {
        // Context for Thymeleaf template
        Context context = new Context();
        context.setVariable("announcement", announcement);


        // Generate email content from template
        String htmlContent = templateEngine.process(templateName, context);


        // Create the email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);


        // Send the email
        mailSender.send(message);
    }

}