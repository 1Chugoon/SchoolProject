using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LearningPlatform.Domain.Courses
{
    public class Module
    {
        public Guid Id { get; private set; }
        public Guid CourseId { get; private set; }
        [JsonIgnore]
        public Course Course { get; private set; } = null!;

        public string Title { get; private set; } = null!;
        public int Order { get; private set; }

        private readonly List<Lesson> _lessons = new();
        public IReadOnlyCollection<Lesson> Lessons => _lessons;

        private Module() { }

        internal Module(Guid id, Guid courseId, string title, int order)
        {
            Id = id;
            CourseId = courseId;
            Title = title;
            Order = order;
        }
        public void UpdateTitle(string title)
        {
            Title = title;
        }

        internal void SetOrder(int order)
        {
            Order = order;
        }



        public Lesson AddLesson(Guid id, string title)
        {
            var lesson = new Lesson(id, Id, title, _lessons.Count);
            _lessons.Add(lesson);
            return lesson;
        }

        public void RemoveLesson(Guid moduleId)
        {
            var lesson = _lessons.First(m => m.Id == moduleId);
            _lessons.Remove(lesson);
            NormalizeOrder();
        }

        public void MoveLesson(Guid lessonId, int newPosition)
        {
            var lesson = _lessons.FirstOrDefault(l => l.Id == lessonId)
                         ?? throw new ArgumentException("Lesson not found", nameof(lessonId));

            _lessons.Remove(lesson);

            if (newPosition < 0 || newPosition > _lessons.Count)
                throw new ArgumentOutOfRangeException(nameof(newPosition));

            _lessons.Insert(newPosition, lesson);

            NormalizeOrder();
        }

        private void NormalizeOrder()
        {
            for (int i = 0; i < _lessons.Count; i++)
            {
                _lessons[i].SetOrder(i);
            }
        }
    }
}
