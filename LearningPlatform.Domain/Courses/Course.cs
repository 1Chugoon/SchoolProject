using LearningPlatform.Domain.Users;
using System.Diagnostics;
using System.Text.Json.Serialization;

namespace LearningPlatform.Domain.Courses
{
    public class Course
    {
        public Guid Id { get; private set; }

        public CourseStatus Status { get; private set; }

        public string Title { get; private set; } = null!;
        public string? Description { get; private set; }

        public decimal Price { get; private set; }
        public float Rating { get; private set; }

        public Guid AuthorId { get; private set; }
        [JsonIgnore]
        public User Author { get; private set; } = null!;

        private readonly List<CourseTag> _courseTags = new();
        public IReadOnlyCollection<CourseTag> CourseTags => _courseTags;

        private readonly List<string> _whatLearn = new();
        public IReadOnlyCollection<string> WhatLearn => _whatLearn;

        private readonly List<Module> _module = new();
        public IReadOnlyCollection<Module> Modules => _module;

        private readonly List<CoursePurchase> _coursePurchase = new();
        public IReadOnlyCollection<CoursePurchase> CoursePurchase => _coursePurchase;

        private string? _imagePath;
        public string? ImagePath => _imagePath;


        private Course() { }

        public Course(Guid id, string title, decimal price, Guid authorId)
        {
            Id = id;
            Title = title;
            Price = price;
            AuthorId = authorId;
            Rating = 0f;
            Status = 0;
        }

        public void UpdateRating(float newRating)
        {
            Rating = newRating;
        }
        public void AddTag(Guid tagId)
        {
            if (_courseTags.Any(t => t.TagId == tagId))
                return;

            _courseTags.Add(new CourseTag(Id, tagId));
        }
        public void Publish()
        {
            if (Status == CourseStatus.Published)
                return;

            Status = CourseStatus.Published;
        }
        public void Update(string title, string description, decimal price, IEnumerable<string> whatLearn)
        {
            Title = title;
            Description = description;
            Price = price;
            _whatLearn.Clear();
            foreach (var item in whatLearn)
                _whatLearn.Add(item);
        }

        public void UpdateImage(string? image)
        {
            _imagePath = string.IsNullOrEmpty(image) ? null : image;
        }


        public Module AddModule(Guid id, string title)
        {
            var module = new Module(id, Id, title, _module.Count);
            _module.Add(module);
            return module;
        }

        public void RemoveModule(Guid moduleId)
        {
            var module = _module.First(m => m.Id == moduleId);
            _module.Remove(module);
            NormalizeOrder();
        }

        public void MoveModule(Guid moduleId, int newPosition)
        {
            if (newPosition < 0 || newPosition >= _module.Count)
                throw new ArgumentOutOfRangeException(nameof(newPosition));

            var module = _module.First(m => m.Id == moduleId);

            _module.Remove(module);
            _module.Insert(newPosition, module);

            NormalizeOrder();
        }

        private void NormalizeOrder()
        {
            for (int i = 0; i < _module.Count; i++)
            {
                _module[i].SetOrder(i);
            }
        }
    }
}

