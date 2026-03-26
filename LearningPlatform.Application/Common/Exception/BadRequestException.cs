namespace LearningPlatform.Application.Common.Exception
{
    
    public class BadRequestException : FormatException
    {
        public BadRequestException(string? message = null) :
            base(message ?? "BadRequest")
        {
        }
    }
}