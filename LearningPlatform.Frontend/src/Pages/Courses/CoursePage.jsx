import { use, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

import config from "../../config.json"

import CourseBuyCard from "../../Components/CourseBuyCard";
import LiOnWhatYouLearn from "../../Components/Lists/LiOnWhatYouLearn";
import TagCard from "../../Components/TagCard";
import CourseLessonsModule from "../../Components/CourseLessonsModule";
import RatingCard from "../../Components/RatingCard";
import ShowText from "../../Components/ShowText";
import StarRating from "../../Components/Rating/StarRatingByUser";
import { toast } from "react-toastify";

function CoursePage() {
  const navigate = useNavigate()

  const [comments, setComments] = useState([]);
  const [course, setCourse] = useState();
  const [Author, setAuthor] = useState();
  const [AuthorImage, setAuthorImage] = useState();

  const defaultPhoto = "/Files/png-people.png";
  const id = useParams().id;


  useEffect(() => {
      axios
      .get(config.BaseURL+ `/courses/${id}`)
      .then(res => {setCourse(res.data);})
      .catch((err) => {
        switch(err.response?.status){
          case 404:toast.error("Не найден ресурс");break;
          case 500: toast.error("Ошибка сервера");break
        }
        navigate("/")
      });

  }, []);

  useEffect(() => {
    if(!course) return;
    axios
    .get(config.BaseURL+ `/users/${course?.Author?.Id}`)
    .then(res => setAuthor(res.data))
    .catch((err) => {
      switch(err.response?.status){
        case 404:toast.error("Автор не найден");break;
        case 500: toast.error("Ошибка сервера");break
      }
    });
    axios
    .get(config.BaseURL+ `/users/${course?.Author?.Id}/avatar`, {responseType: 'blob'})
    .then(res => {
      const imageUrl = URL.createObjectURL(res.data);
      setAuthorImage(imageUrl);
    })
    .catch((err) => {
      switch(err.response?.status){
        case 500: toast.error("Ошибка сервера");break
      }
    });
  }, [course])



  return (
    <div>
      <svg style={{ display: "none" }}>
        <use href="#id">
          <symbol id="check-icon" viewBox="0 -960 960 960">
            <path d="m382-339.38 345.54-345.54q8.92-8.93 20.88-9.12t21.27 9.12 9.31 21.38q0 12.08-9.31 21.39l-362.38 363q-10.85 10.84-25.31 10.84t-25.31-10.84l-167-167q-8.92-8.93-8.8-21.2.11-12.26 9.42-21.57t21.38-9.31q12.08 0 21.39 9.31z"></path>
          </symbol>
        </use>
      </svg>



      <header className="black-container-header">
        <span>{course?.Title}</span>
        {/*<p style={{display:"flex",fontSize:"1rem", alignItems:"center"}}>
            <span style={{marginRight:"5px", color:"#FFD700"}}>{course?.Rating}</span>
            <StarRating rating={course?.Rating} SizeStar={14}/> 
        </p>*/}
      </header>

      <div className="black-container">
        <div className="black-container-content">
          <div style={{ marginInlineStart:"2.4rem" ,marginInlineEnd:"2.4rem"  }}>
          <h1 style={{fontSize:"30px"}} >{course?.Title ?? "null"}</h1>
          {/*<p style={{display:"flex",fontSize:"1.2rem", alignItems:"center"}}>
            <span style={{marginRight:"5px", color:"#FFD700"}}>{course?.Rating}</span>
            <StarRating rating={course?.Rating} SizeStar={16}/> 
          </p>*/}
          <p>Автор: {course?.Author.Name}</p>
          </div>
        </div>
      </div>
      <div className="container-main-page-course">
        <div className="container-main-page-content">
          <div className="what-you-learn-module">
            <div style={{flex:"1"}}>
              <div style={{border:"1px solid #aaa", marginTop:"8px"}}>
                <p style={{fontSize:"24px", marginBottom:"10px", padding:"15px",fontStyle:"var(--font-family-arial)"}}><b>Чему вы научитесь</b></p> 
                <ul className="what-you-learn-list">
                {course?.WhatLearn?.map((item, index) => (
                    <LiOnWhatYouLearn key={index} Text={item}/>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          {/*<div className="container-tags">
            <h2>Tags</h2>
            <ul className="tags-list">

              {course?.tags?.map((text,index)=>(
                <li>
                  <TagCard key={index} Text={text}/>
                </li>
              ))}
            </ul>
          </div>*/}
          <div className="course-content-module">
            <h2>Материал курса</h2>
            <div className="course-content-list-and-btns">
              {course?.Modules?.map((item,index) =>(
                <CourseLessonsModule dataMaterials={item?.Lessons} name={item?.Title}/>
                ))}
            </div>    
          </div>
            <div className="description-course-content-module">
                <h2>Описание</h2>
              <ShowText text={course?.Description}/>
          </div>
          <div className="author-description-module">
              <h2>Автор</h2>
              <div className="author-description-container">
                <h3 className="author-name" style={{width:"max-content"}} onClick={()=>navigate(`/user/${Author?.Id}`)}>{course?.Author.Name}</h3>
                <div className="author-image-and-stats">
                  <img src={AuthorImage ?? defaultPhoto} alt="" width={"64"} height={"64"} style={{borderRadius:"50px",width:"6.4rem",height:"6.4rem", marginRight:"20px"}}></img>
                  {/*<ul>
                    {course?.Author?.Achievements?.map((item,index)=>(
                      <li key={index}>{item}</li>
                    ))
                  </ul>*/}
                </div>
                <div style={{margin:"16px 0"}}>
                  <ShowText maxLength={200}  text={Author?.Description}/>
                </div>
              </div>
          </div>
          {/*<div className="rating-course-module">
              <h2>Отзывы</h2>
              <ul className="rating-list">
                {
                  comments.map((item,index) => (
                    <li key={index}>
                      <RatingCard CommentText={item?.comment} Rating={item?.Rating} User={item?.User}/>
                    </li>
                  ))
                }
              </ul>
          </div>*/}
        </div>
      </div>
      <div className="course-buy-card-container">
        <CourseBuyCard Price={course?.buyCardDescription?.Price} Description={course?.buyCardDescription?.Description} Id={course?.Id}/>
      </div>
    </div>
  );
}

export default CoursePage;