import {  useState } from "react";
import { useNavigate } from "react-router-dom";

function ListOnLesson({data}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  }
  

  const navigate = useNavigate();
  return (
    <div className="list-on-lesson">
      <svg style={{ display: "none" }}>
          <use href="#icon-expand">
            <symbol id="icon-expand" viewBox="0 -960 960 960">
              <path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69t21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08t-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92T480-372.92"></path>
            </symbol>
          </use>
      </svg>

    <div onClick={handleClick} style={{display:"flex", alignItems:"start", justifyContent:"start"}}>
      <svg  width="24" height="24" style={{minWidth:"16px", minHeight:"16px", marginTop:"5px",transform: isVisible ? "scaleY(-1)" : "scaleY(1)",transformOrigin: "center center"}}>
        <use href="#icon-expand"/>
      </svg>



      <div className="main-info">
        <h2>{data?.Title}</h2>
        <p>{data?.time}</p>
      </div>
    </div>
      {isVisible && <div className="list-lessons">

        <ul>  
        {data?.Lessons?.map((item,index)=>(
          <div key={index}>
            <span onClick={()=>navigate("/course/"+data?.Id+"/learn/"+item?.Id)} style={{cursor:"pointer"}}>
              {item?.Title}
            </span>
          </div>
        ))}
        </ul>
        </div>}
    </div>
  );
}

export default ListOnLesson;