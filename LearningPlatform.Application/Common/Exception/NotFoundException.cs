namespace LearningPlatform.Application.Common.Exception
{
    public class NotFoundException : FormatException
    {
        public NotFoundException(string? message = null)
        : base(message ?? "NotFound")
        {
        }
    }
}