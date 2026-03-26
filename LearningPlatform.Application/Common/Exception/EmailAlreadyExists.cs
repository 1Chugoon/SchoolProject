namespace LearningPlatform.Application.Common.Exception
{
    public class EmailAlreadyExists : FormatException
    {
        public EmailAlreadyExists(string? message = null) :
            base(message ?? "Email Already Exist")
        {
        }
    }
}
