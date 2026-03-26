namespace LearningPlatform.Domain.DTO
{
    public sealed record UserCourseDto(
        Guid Id,
        string Title,
        DateTime PurchasedAt);
}
