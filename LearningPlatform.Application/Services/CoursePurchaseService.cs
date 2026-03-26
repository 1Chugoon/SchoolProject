using LearningPlatform.Application.Abstractions;
using LearningPlatform.Application.Common.Exception;
using LearningPlatform.Domain.Courses;

namespace LearningPlatform.Application.Services
{
    public class CoursePurchaseService(ICoursePurchaseRepository purchaseRepository, ICourseRepository courseRepository)
    {
        private readonly ICoursePurchaseRepository _purchaseRepository = purchaseRepository;
        private readonly ICourseRepository _courseRepository = courseRepository;

        public async Task<bool> CanAccessAsync(Guid userId, Guid courseId)
        {
            return await _purchaseRepository.HasAccessAsync(userId, courseId);
        }

        public async Task PurchaseAsync(Guid userId, Guid courseId)
        {
            if(await _courseRepository.GetByIdAsync(courseId) == null ) throw new NotFoundException();
            if (await _purchaseRepository.HasAccessAsync(userId,courseId) == true) throw new CourseAlreadyPurchase();

            var purchase = new CoursePurchase(
                Guid.NewGuid(),
                userId,
                courseId);

            await _purchaseRepository.AddAsync(purchase);

        }
    }
}
