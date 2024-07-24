using System;
using System.IO;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using DotNetEnv; // Użyj DotNetEnv do odczytywania zmiennych środowiskowych z .env

namespace SoftCheker.Server.Services
{
    public interface IEmailService
    {
        Task SendTestEmailAsync();
        Task SendWarningEmailAsync(string subject, string bodyText, string bodyHtml);
    }

    public class EmailService : IEmailService
    {
        private readonly ISmtpConfigService _smtpConfigService;
        private readonly string _smtpPassword;

        public EmailService(ISmtpConfigService smtpConfigService)
        {
            _smtpConfigService = smtpConfigService;
            _smtpPassword = Env.GetString("SMTP_PASSWORD"); 
        }

        public async Task SendTestEmailAsync()
        {
            var smtpConfig = await _smtpConfigService.GetConfigAsync();
            if (smtpConfig == null)
            {
                throw new InvalidOperationException("SMTP configuration is not set up.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("", smtpConfig.SmtpUsername));
            message.To.Add(new MailboxAddress("", smtpConfig.RecipientEmail));
            message.Subject = "Wiadomosc testowa";

            var bodyBuilder = new BodyBuilder
            {
                TextBody = "Test SMTP",
                HtmlBody = "<p>Test SMTP</p>"
            };
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(smtpConfig.SmtpServer, smtpConfig.SmtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(smtpConfig.SmtpUsername, _smtpPassword); 
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("An error occurred while sending the email.", ex);
                }
            }
        }

        public async Task SendWarningEmailAsync(string subject, string bodyText, string bodyHtml)
        {
            var smtpConfig = await _smtpConfigService.GetConfigAsync();
            if (smtpConfig == null)
            {
                throw new InvalidOperationException("SMTP configuration is not set up.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("", smtpConfig.SmtpUsername));
            message.To.Add(new MailboxAddress("", smtpConfig.RecipientEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                TextBody = bodyText,
                HtmlBody = bodyHtml
            };
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(smtpConfig.SmtpServer, smtpConfig.SmtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(smtpConfig.SmtpUsername, _smtpPassword); 
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("An error occurred while sending the email.", ex);
                }
            }
        }
    }
}
