namespace LearningPlatform.Domain.DTO
{
    public record LessonDto(
        Guid Id, 
        string Title, 
        int Order);
}
