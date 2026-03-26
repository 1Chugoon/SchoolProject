namespace LearningPlatform.Api.DTO.Requests
{
    public record CreateLessonDto(
        Guid ModuleId,
        string Title,
        int Order);
}
