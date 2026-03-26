import { useRef,useEffect,useState} from "react";
import { data, useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config.json"

import MainBtns from "../../Components/Buttons/MainBtns";
import InputForm from "../../Components/Input/InputForm";
import ListOnEdit from "../../Components/Lists/ListOnEdit";
import {NestedList} from "../../Components/Lists/NestedList";
import {ListLessonForEdit} from "../../Components/Lists/ListLessonForEdit";
import { toast } from "react-toastify";


function EditCoursePage() {

  const {id} = useParams()

  const [root, setRoot] = useState({
      Title: "Список уроков",
      collapsed: false,
      Modules: []
    });

  const leftListRef = useRef();
  const [course,setCourse] = useState()

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const WhatLearn = useRef();
  const [image, setImage] = useState(null);
  const [realImage, setRImage] = useState();

  const navigate = useNavigate();


  useEffect(() => {
    axios
    .get(config.BaseURL + "/courses/"+id,{withCredentials:true})
    .then(res=> {
        setRoot(res.data);
        leftListRef.current.loadData(res.data);
        WhatLearn.current.loadData(res.data?.WhatLearn);
        setCourse(res.data);
        console.log(res.data);
        setTitle(res.data?.Title);
        setDescription(res.data?.Description)
      })
    .catch((e) => {})
  }, []);
  const handleSaveDescription = () => {
    const data = {
  "title": course.Title,
  "description": description,
  "price": 0,
  "whatLearn": course.WhatLearn
    }
  axios
    .put(config.BaseURL + `/courses/${id}`,
      data,
      {withCredentials:true}
    ) 
    .then(()=>toast.success("Успешно сохранено"))
    .catch((err)=> toast.error("Ошибочка"))
  };

  const handleSaveName = () => {
    const data = {
  "title": `${title}`,
  "description": course.Description,
  "price": 0,
  "whatLearn": course.WhatLearn
}

  axios
    .put(config.BaseURL + `/courses/${id}`,
      data,
      {withCredentials:true}
    ) 
    .then(()=>toast.success("Успешно сохранено"))
    .catch((err)=> toast.error("Ошибочка"))
  };

  const refresh = async () => {
  const { data } = await axios.get(config.BaseURL + "/courses/"+id,{withCredentials:true});
  setRoot(data);
};

  const handleSaveWhatLearn = () => {
    const arr = WhatLearn.current.getData()
    const data = {
      "title": course.Title,
      "description":course.Description,
      "price":0,
      "whatLearn":arr.map(item => item )
    }
    axios
    .put(config.BaseURL + `/courses/${id}`,
      data,
      {withCredentials:true}
    ) 
    .then(()=>toast.success("Успешно сохранено"))
    .catch((err)=> toast.error("ошибка"))
  }


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setRImage(file)
    } else {
      setImage(null);
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const savePhoto = () =>{

    const formData = new FormData();
    formData.append("file", realImage);

    axios.post(`${config.BaseURL}/courses/${id}/image`,
      formData,
      {
        withCredentials:true,
        headers:{
        "Content-Type": "multipart/form-data",
      }}
    )
    .then(()=> delay(100))
    .then(toast.success("успешно сохранено"))
    .catch((e)=>{toast.error("ошибка сохранения"); console.log(e)})
}
  return (
    <div>
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
          <div>
            <h2>Name</h2>
            <InputForm zstyle={"mini-input"} TextPlaceholder={"Name of Course"} defaultText={title} funct={setTitle}/>
           {/*<InputForm zstyle={"mini-input"} TextPlaceholder={"Price ₺"}/>*/}
            <MainBtns Style={"purple-btn"} Text={"Сохранить"} Funct={handleSaveName}/>
          </div>

          <div>
            <div className="photo-preview-wrap">
              <div className="photo-preview-inner">
                <div className="image-preview">
                  {image ? (
                    <img src={image} alt="preview" />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="photo-controls">
              <div className="file-input-row">
                <InputForm zstyle={"void"} type={"file"} TextPlaceholder={"image"} accept={"image/*"} Id={"InputImage"} funct={handleFileChange} />
                <label htmlFor="InputImage" className="image-input">Загрузить картинку</label>
              </div>
              <div className="photo-save-row">
                <MainBtns Style={"purple-btn"} Text={"Сохранить"} Funct={savePhoto}/>
              </div>
            </div>
          </div>
          <div>
            <h2>What learn</h2>
            <ListOnEdit ref={WhatLearn}/>
            <MainBtns Style={"purple-btn"} Funct={handleSaveWhatLearn} Text={"Сохранить"}/>
          </div>
          <div style={{display:"flex", flexDirection:"column"}}>
            <h2>Description</h2>
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="text-area" style={{marginBottom:"15px"}}></textarea>
            <MainBtns Style={"purple-btn"} Text={"Сохранить"} Funct={handleSaveDescription}/>
          </div>
          {/*<div>
            <ListOnEdit Name={"Tags"}/>
            <div style={{marginBottom:"15px"}}></div>
            <MainBtns Style={"purple-btn"} Text={"Сохранить"} Funct={{}}/>
          </div>*/}
          <div>
            <NestedList root={root} setRoot={setRoot} refresh={refresh}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCoursePage;