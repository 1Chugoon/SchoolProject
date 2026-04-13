using LearningPlatform.Application.Abstractions;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace LearningPlatform.Infrastructure.Email
{
    public class EmailSender(IConfiguration config) : IEmailSender
    {
        private readonly IConfiguration _config = config;
        public async Task SendAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("EmailSender", _config["Other:Email"]!));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart("plain") { Text = body };

            using var client = new SmtpClient();

            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_config["Other:Email"]!, _config["Other:Secret"]!);
            await client.SendAsync(email);
            await client.DisconnectAsync(true);
        }
    }
}
