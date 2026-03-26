import { useEffect, useState } from 'react';
import './CoursesUsPage.css';
import axios from 'axios';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import CreateCourseDialog from '../../Components/CreateCourseDialog';
import { toast } from 'react-toastify';


export default function CreatedCoursesPage() {

  const [userCourses, setUserCourses] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const [open,setOpen] = useState(false)

  const handleCreate = async(title) => {
    try{
      await axios
      .post(config.BaseURL + "/courses",
        {title, price:"0"},
        {withCredentials:true}
      );
    }catch(e){
      toast.error("Ошибка при создании курса")
    }
  }
  const handlePublish = async(id) =>{
    try{
      await axios
      .post(config.BaseURL + `/courses/${id}/publish`,{},{withCredentials:true})
    }catch(e){
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try{
        const meRes = await axios.get(`${config.BaseURL}/me`, { withCredentials: true });
        const uid = meRes?.data?.Id;
        if (!uid) throw new Error('Не удалось получить id пользователя');
        if (cancelled) return;
        setUserId(uid);

        const userCoursesRes = await axios.get(`${config.BaseURL}/users/${uid}/created-courses`, { withCredentials: true });
        const coursesList = Array.isArray(userCoursesRes.data) ? userCoursesRes.data : [];

        if (cancelled) return;

        const courseIds = coursesList.map(c => c.Id || c.id || c._id).filter(id => !!id);

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
      } 
      //Конец try
      catch (err) {
      if (cancelled) return;
      setError(err.message || 'Ошибка при загрузке курсов');
    }
    finally {
        if (!cancelled) setLoading(false);
      }
  }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, [])

  if (loading) {
    return (
      <div className="courses-page">
        <h2 className="page-title">Созданные курсы</h2>
        <p className="empty-text">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page empty">
        <h2 className="page-title">Созданные курсы</h2>
        <p className="empty-text">{error}</p>
      </div>
    );
  }
  if (!userCourses || userCourses.length === 0) {
    return (
      <div className="courses-page empty">
        <h2 className="page-title">Созданные курсы</h2>
        <h2 className='btn primary' style={{margin:"5px"}} onClick={()=>setOpen(true)}>Создать Курс</h2>
        <CreateCourseDialog
        open={open}
        message={"Введите название курса"}
        onCancel={() => setOpen(false)}
        onConfirm={handleCreate}
        />
      </div>
    );
  }


  return (
    <div className="courses-page">
      <CreateCourseDialog
        open={open}
        message={"Введите название курса"}
        onCancel={() => setOpen(false)}
        onConfirm={handleCreate}
        />

      <h2 className="page-title">Созданные курсы</h2>
      <h2 className='btn primary' style={{margin:"5px"}} onClick={()=>setOpen(true)}>Создать Курс</h2>
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
                <h3 className="course-title">{c.Title}</h3>
                <div className="course-meta">
                  <span className="course-lessons">{moduleCount} модулей • {lessonCount} уроков</span>
                </div>
                <div className="course-actions">
                  <button className="btn ghost" onClick={() => nav(`/course/${c?.Id}/edit`)}>Редактировать</button>
                  {c?.Status == "Draft" ? (<button onClick={() => handlePublish(c?.Id) } className='btn primary'>Опубликовать</button>) : (<></>)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
    </div>
  );
}
