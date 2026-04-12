import { useEffect, useState} from "react";
import axios from "axios";

import CourseCard from "../Components/CourseCard";
import config from "../config.json"


function MainPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    axios
      .get(config.BaseURL+"/courses")
      .then(res => {setCourses(res.data)})
      .catch(() => setError("Ошибка запроса"));
  }, []);

  return (
    <div className="main-page">
      
      {/*<div className="lesson-filter-container">
        <div className="filter">
          <h4>Сортировать по</h4>
          <select id="group--1" className="select-filter">
            <option>Дата создания</option>
            <option>Количество покупок</option>
            <option>Рейтинг</option>
          </select>
        </div>*/}

        <div className="lessons">
          <ul>
            {courses.map((item,index)=>(
              <li>
                <CourseCard key={index} courseInfo={item}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default MainPage;