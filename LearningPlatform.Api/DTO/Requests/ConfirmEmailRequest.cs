namespace LearningPlatform.Api.DTO.Requests
{
    public record ConfirmEmailRequest(
    Guid UserId,
    string Token
);
}
