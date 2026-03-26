namespace LearningPlatform.Domain.Users
{
    public class EmailConfirmationToken
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string TokenHash { get; private set; } = null!;
        public DateTime ExpiresAtUtc { get; private set; }
        public bool Used { get; private set; }

        private EmailConfirmationToken() { }

        public EmailConfirmationToken(Guid userId, string tokenHash, TimeSpan lifetime)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            TokenHash = tokenHash;
            ExpiresAtUtc = DateTime.UtcNow.Add(lifetime);
            Used = false;
        }

        public void MarkAsUsed()
        {
            if (Used) throw new Exception("Token already used");
            if (ExpiresAtUtc < DateTime.UtcNow) throw new Exception("Token expired");
            Used = true;
        }
    }
}
