using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;

namespace LearningPlatform.Application.UseCases.User
{
    public class ConfirmEmail
    {
        private readonly IUserRepository _userRepo;
        private readonly IEmailTokenRepository _tokenRepo;
        private readonly ITokenService _tokenService;

        public ConfirmEmail(
            IUserRepository userRepo,
            IEmailTokenRepository tokenRepo,
            ITokenService tokenService)
        {
            _userRepo = userRepo;
            _tokenRepo = tokenRepo;
            _tokenService = tokenService;
        }

        public async Task ExecuteAsync(Guid userId, string token, CancellationToken ct)
        {
            var hash = _tokenService.HashToken(token);

            var record = await _tokenRepo.GetValidTokenAsync(userId, hash, ct)
                ?? throw new Exception("Invalid token");

            record.MarkAsUsed();

            var user = await _userRepo.GetByIdAsync(userId, ct)
                ?? throw new NotFoundException("Not found User");

            user.ConfirmEmail();

            await _userRepo.SaveAsync(user);
        }
    }
}
