using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Domain.Users
{
    public class User
    {
        public Guid Id { get; private set; }

        public string Email { get; private set; } = null!;
        public string PasswordHash { get; private set; } = null!;

        public bool EmailConfirmed { get; private set; }

        public string Name { get; private set; } = null!;
        public string? Description { get; private set; }

        public Role Role { get; private set; }

        private readonly List<CoursePurchase> _coursePurchase = new();
        public IReadOnlyCollection<CoursePurchase> CoursePurchase => _coursePurchase;

        private string? _avatarFileName;
        public string? AvatarFileName => _avatarFileName;

        private User() { }

        public User(Guid id, string email, string passwordHash, string name, Role role)
        {
            Id = id;
            Email = email;
            PasswordHash = passwordHash;
            Name = name;
            Role = role;
            EmailConfirmed = false;
        }
        public User(Guid id, string email, string passwordHash, string name, Role role,bool confEmail)
        {
            Id = id;
            Email = email;
            PasswordHash = passwordHash;
            Name = name;
            Role = role;
            EmailConfirmed = confEmail;
        }
        public void SetAvatar(string? avatarFileName)
        {
            _avatarFileName = string.IsNullOrEmpty(avatarFileName) ? null : avatarFileName;
        }
        public void ConfirmEmail()
        {
            EmailConfirmed = true;
        }

        public void UpdateDescription(string? description)
        {
            Description = description;
        }
        public void UpdateName(string name)
        {
            Name = name;
        }
        public void UpdatePasswordHash(string passwordHash)
        {
            PasswordHash = passwordHash;
        }
        public void UpdateEmail(string email)
        {
            Email = email;
        }

    }
}
