import { useNavigate, useParams } from "react-router-dom";
import { useRef,useEffect, useState} from "react";

import {ListLessonForEdit} from "../../Components/Lists/ListLessonForEdit";
import InputForm from "../../Components/Input/InputForm";
import axios from "axios";
import config from "../../config.json"
import { toast } from "react-toastify";

function EditLessonPage() {
  const navigate = useNavigate();
  const {id, idLesson} = useParams()
  const [course, SetCourse] = useState()
  

  const leftListRef = useRef();

  useEffect(() => {
    axios
    .get(config.BaseURL + "/courses/"+id,{withCredentials:true})
    .then(res=> {leftListRef.current.loadData(res.data); SetCourse(res.data)})
    .catch((e) => console.log())
  }, []);

  
 const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const module = course.Modules.find(m =>
    m.Lessons.some(l => l.Id === idLesson)
  );

  if (!module) return;

  const formData = new FormData();
  formData.append("file", file);

  axios.put(
    `${config.BaseURL}/modules/${module.Id}/lessons/${idLesson}/upload`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  .then(() => toast.done("Успешно"))
  .catch((err) => console.log(err));
};



  return (
    <div className="edit-course-box">
      <div className="left-panel-in-edit-course-page">
          <div style={{borderBottom:"1px solid var(--second-neutral-color-gray)", width:"100%",display:"flex",alignItems:"center", justifyContent:"center"}}>
            <h3 onClick={()=> navigate("/course/"+id)}>Предпросмотр</h3>
          </div>
          <div style={{borderBottom:"1px solid var(--second-neutral-color-gray)", width:"100%",display:"flex",alignItems:"center", justifyContent:"center"}}>
            <h3 onClick={()=> navigate("/course/"+id+"/edit")} >Main</h3>
          </div>
          <div style={{marginTop:"15px"}}>
            <ListLessonForEdit ref={leftListRef}/>
          </div>
        </div>

      <div className="main-edit">
        <div className="info-about-page">
          <h2>
            Редактирование урока
          </h2>
        </div>
        <div className="download-data">
          <InputForm zstyle={"void"} type={"file"} accept={".zip"} Id={"InputMd"} funct={handleFileChange} />
          <label htmlFor="InputMd" className="file-input">Загрузить</label>
          <p style={{color:"#0000005e", marginTop:"15px"}}>Инструкция:"необходимо загрузить Zip файл содержащий 1 файл md и "images" папку со всеми изображениями"</p>
        </div>
      </div>

    </div>
  );
}

export default EditLessonPage;