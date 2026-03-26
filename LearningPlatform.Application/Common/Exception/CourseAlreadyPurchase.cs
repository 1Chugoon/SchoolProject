namespace LearningPlatform.Application.Common.Exception
{
    public class CourseAlreadyPurchase: FormatException
    {
        public CourseAlreadyPurchase(string? message = null) :
            base(message ?? "Course Already Purchase")
        {
        }
    }
}
