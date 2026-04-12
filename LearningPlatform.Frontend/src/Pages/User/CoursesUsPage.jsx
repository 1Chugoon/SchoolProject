import { useEffect, useState } from 'react';
import './CoursesUsPage.css';
import axios from 'axios';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';

const sampleCourses = [
  {
    id: 'c1',
    title: 'Введение в React',
    author: 'Иван Иванов',
    progress: 45,
    lessons: 12,
    thumbnail: '/Files/sample-course-1.jpg',
  },
];

function extractUserId(meData) {
  return (
    meData?.Id || meData?._id || meData?.userId || meData?.user?._id || meData?.user?.id
  );
}

export default function CoursesUsPage() {
  const [userCourses, setUserCourses] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  function navigateToFirstLesson(course) {
    const modules = course.Modules || course.modules || [];
    if (!modules || modules.length === 0) {
      // fallback to course page
      const courseId = course?.Id || course?.id || course?._id;
      nav(`/course/${courseId || ''}`);
      return;
    }

    const firstModule = modules[0];
    const moduleId = firstModule?.Id || firstModule?._id;
    const lessons = firstModule?.Lessons || firstModule?.lessons || [];
    const firstLesson = lessons[0];
    const lessonId = firstLesson?.Id || firstLesson?._id;

    if (moduleId && lessonId) {
      nav(`/course/${moduleId}/learn/${lessonId}`);
    } else if (moduleId) {
      nav(`/course/${moduleId}/learn`);
    } else {
      const courseId = course?.Id || course?.id || course?._id;
      nav(`/course/${courseId || ''}`);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        // 1) получить id юзера
        const meRes = await axios.get(`${config.BaseURL}/me`, { withCredentials: true });
        const uid = extractUserId(meRes.data);
        if (!uid) throw new Error('Не удалось получить id пользователя');
        if (cancelled) return;
        setUserId(uid);

        // 2) получить список курсов у пользователя
        const userCoursesRes = await axios.get(`${config.BaseURL}/users/${uid}/courses`, { withCredentials: true });
        const coursesList = Array.isArray(userCoursesRes.data) ? userCoursesRes.data : [];

        if (cancelled) return;

        // 3) для каждого курса получить полные данные (если возвращаются только id)
        const courseIds = coursesList.map((it) => it?.Id || it?.courseId || it?._id || it);

        const fullCourses = await Promise.all(
          courseIds.map(async (cid, idx) => {
            if (!cid) return null;
            try {
              //const r = await axios.get(`${config.BaseURL}/courses/${cid}`, { withCredentials: true });

              const r = await axios.get(
                `${config.BaseURL}/courses/${cid}`,
                  { withCredentials: true });
              let thumbnail = null;
              try {
                const imageResponse = await axios.get(
                  `${config.BaseURL}/courses/${cid}/image`,
                  { withCredentials: true, responseType: "blob" }
                );
                thumbnail = URL.createObjectURL(imageResponse.data);
                } catch (imgErr) {
                  
                }

              return { ...r.data, thumbnail };
            } catch (e) {
              // если получение полного курса упало — попытаемся использовать пришедший объект
              return typeof coursesList[idx] === 'object' ? coursesList[idx] : null;
            }
          })
        );
        const filtered = fullCourses.filter(Boolean);
        if (!cancelled) setUserCourses(filtered.length ? filtered : []);
      } catch (e) {
        if (!cancelled) {
          setError('Ошибка загрузки данных');
          setUserCourses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="courses-page">
        <h2 className="page-title">Мои курсы</h2>
        <p className="empty-text">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page empty">
        <h2 className="page-title">Мои курсы</h2>
        <p className="empty-text">{error}</p>
      </div>
    );
  }

  if (!userCourses || userCourses.length === 0) {
    return (
      <div className="courses-page empty">
        <h2 className="page-title">Мои курсы</h2>
        <p className="empty-text">У вас пока нет курсов. Посмотрите каталог и добавьте первый курс.</p>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <h2 className="page-title">Мои курсы</h2>
      <ul className="courses-list">
        {userCourses.map((c) => {
          const modules = c.Modules || c.modules || [];
          const moduleCount = modules.length;
          const lessonCount = modules.reduce((sum, m) => {
            const lessons = m?.Lessons || m?.lessons || [];
            return sum + (Array.isArray(lessons) ? lessons.length : 0);
          }, 0);

          return (
            <li key={c.id || c._id} className="course-card">
              <div className="thumb-wrap">
                {c.thumbnail ? (
                  <img src={c.thumbnail} alt={c.title} className="course-thumb" />
                ) : (
                  <div className="thumb-placeholder">Курс</div>
                )}
              </div>
              <div className="course-info">
                <h3 className="course-title">{c?.Title}</h3>
                <div className="course-meta">
                  <span className="course-author">{c?.Author?.Name || ''}</span>
                  <span className="course-lessons">{moduleCount} модулей • {lessonCount} уроков</span>
                </div>
                <div className="course-actions">
                  <button className="btn primary" onClick={() => navigateToFirstLesson(c)}>Продолжить</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
