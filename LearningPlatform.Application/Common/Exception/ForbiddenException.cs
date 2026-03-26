
namespace LearningPlatform.Application.Common.Exception
{
    public class ForbiddenException : FormatException
    {
        public ForbiddenException(string? message = null)
        : base(message ?? "Forbidden")
        {
        }
    }
}
