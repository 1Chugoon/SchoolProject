using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.Users;
namespace LearningPlatform.Application.UseCases.User
{
    public class RegisterUser(IUserRepository users,
        IPasswordHasher hasher, 
        ITokenService tokenService,
        IEmailTokenRepository tokenRepo, 
        IEmailSender emailSender)
    {
        private readonly IUserRepository _users = users;
        private readonly IPasswordHasher _hasher = hasher;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailSender _emailSender = emailSender;
        private readonly IEmailTokenRepository _tokenRepo = tokenRepo;

        public async Task<Guid> ExecuteAsync(
            string email,
            string password,
            string name,
            CancellationToken ct,
            string? domain)
        {
            var existing = await _users.GetByEmailAsync(email, ct);
            if (existing != null) throw new EmailAlreadyExists("Email already used");

            var passwordHash = _hasher.Generate(password);

            var user = new Domain.Users.User(new Guid(),email, passwordHash,name,Role.User);
            await _users.AddAsync(user, ct);

            var rawToken = _tokenService.GenerateToken();
            var tokenHash = _tokenService.HashToken(rawToken);

            var token = new EmailConfirmationToken(
                user.Id,
                tokenHash,
                TimeSpan.FromMinutes(30));

            await _tokenRepo.AddAsync(token, ct);

            if (string.IsNullOrEmpty(domain)){
                throw new Exception("Domain cannot be null or empty");
            }

            var link = $"https://{domain}/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(rawToken)}";

            var body = $"Здравствуйте!\r\n\r\nБлагодарим вас за регистрацию. Чтобы активировать ваш аккаунт и получить доступ ко всем функциям сервиса, пожалуйста, подтвердите свой адрес электронной почты, перейдя по ссылке ниже:\r\n\r\n {link}\r\n\r\nЕсли вы не регистрировались на нашем ресурсе, просто проигнорируйте это письмо.";
            

            await _emailSender.SendAsync(
                user.Email,
                "Confirm email",
                body);

            return user.Id;
        }
    }
}