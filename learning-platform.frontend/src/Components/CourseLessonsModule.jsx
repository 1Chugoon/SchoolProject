import { useState, useEffect } from "react";

function CourseLessonsModule({dataMaterials, name}) {
  const [isVisible, setIsVisible] = useState(false);
  const [materialsForLesson, setMaterials] = useState([]);

  const nameOfLesson = name ?? "NULLABLE";

  const getValueDM = () =>{
    var material = dataMaterials?.map(item=>({
      title: item?.Title ?? "NULL",
    })) ?? [];
    return material;
  }

  useEffect(() => {
    const materials = getValueDM();
    setMaterials(materials);
  }, []);

  const handleClick = () => {
    setIsVisible(!isVisible);
    if (materialsForLesson?.length === 0){
      var material = getValueDM();
      setMaterials(material);}
  }

  return (
    <div className="lesson-panel-module">
      <svg style={{ display: "none" }}>
        <use href="#icon-expand">
          <symbol id="icon-expand" viewBox="0 -960 960 960">
            <path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69t21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08t-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92T480-372.92"></path>
          </symbol>
        </use>
      </svg>




      <div className="lesson-panel-btn" onClick={handleClick}>
        <svg width="24" height="24" style={{minWidth:"16px", minHeight:"16px", marginTop:"5px",transform: isVisible ? "scaleY(-1)" : "scaleY(1)",transformOrigin: "center center"}}>
          <use href="#icon-expand"/>
        </svg>
        <h3 style={{flex:"1", fontWeight:"600"}}>{nameOfLesson}</h3>
      </div>
      {isVisible && <div className="lesson-panel-content">
        <ul>
          {materialsForLesson.map((lesson,index)=>(
            <li style={{display:"flex"}} key={index}>
              <span style={{flex:"1"}}>{lesson.title}</span>
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
}

export default CourseLessonsModule;