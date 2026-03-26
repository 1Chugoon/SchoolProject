

namespace LearningPlatform.Application.Common.Exception
{
    public class InvalidCredentials : FormatException
    {
        public InvalidCredentials(string? message = null)
        : base(message ?? "Invalid credentials")
        {
            
        }
    }
}
