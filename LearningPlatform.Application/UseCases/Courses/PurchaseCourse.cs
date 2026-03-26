using LearningPlatform.Application.Abstractions;
using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.UseCases.Courses
{
    public class PurchaseCourse(ICoursePurchaseRepository repository)
    {
        private readonly ICoursePurchaseRepository _repository = repository;

        public async Task ExecuteAsync(Guid userId, Guid courseId)
        {
            var purchase = new CoursePurchase(Guid.NewGuid(), userId, courseId);
            await _repository.AddAsync(purchase);
        }
    }
}
