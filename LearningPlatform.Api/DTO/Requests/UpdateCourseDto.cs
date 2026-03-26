namespace LearningPlatform.Api.DTO.Requests
{
    public record UpdateCourseDto(
    string Title,
    string Description,
    decimal Price,
    IReadOnlyCollection<string> WhatLearn
    );
}
