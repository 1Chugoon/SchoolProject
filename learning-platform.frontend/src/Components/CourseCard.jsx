import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import config from "../config.json"
import StarRating from "./Rating/StarRatingByUser";
import TagCard from "./TagCard";

function CourseCard({courseInfo = {rating:0}}) {

  const navigate = useNavigate()
  const crr = "#f7c41cff"
  const [courseImage, setCourseImage] = useState();

useEffect(()=>{
  axios.get(config.BaseURL + "/courses/"+courseInfo.Id+"/image",{responseType: "blob"})
  .then(res=> setCourseImage(URL.createObjectURL(res.data)))
  .catch(()=> setCourseImage(""))
},[courseInfo?.Id])

  return (
    <div className="course-card" onClick={()=> navigate("/course/"+courseInfo.Id)}>
      <img src={courseImage} alt=""/>
      <div className="course-card-content">
        <h3>{courseInfo?.Title}</h3>
        <span>{courseInfo?.Description}</span>

        <ul className="tag-list">
          {courseInfo?.tags?.map((item,index)=>(
            <li className="tag-list-item" key={index}>
              <TagCard Text={item}/>
            </li>
          ))}
        </ul>

        {/*<<p className="rating-row">
          <span className="rating-value" style={{color: crr}}>{courseInfo?.Rating}</span>
          StarRating rating={courseInfo?.Rating} SizeStar={16} Clr={crr}/>
        </p>*/}

        <div className="price-badge">
          <span>{courseInfo?.Price === 0 ? "бесплатно": courseInfo.Price}</span>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;