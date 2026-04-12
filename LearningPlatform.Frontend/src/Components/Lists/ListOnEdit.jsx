import {  forwardRef, useImperativeHandle, useState } from "react";

import InputFormForList from "../Input/InputFormForList";
import InputForm from "../Input/InputForm";


const ListOnEdit = forwardRef(({Name, NestedList, Daughter},ref) => {
  const [isVisible, setIsVisible] = useState(true);
  const [data, setData] = useState([]);
  const [name, setName] = useState();


  const handleClick = () => {
    setIsVisible(!isVisible);
  }
  const addItem = () => {
  setData(p => [...p, ""]);
};

function handleNameChange(text){
  setName(text);
}

function handleChange(index, text) {
  setData(prev => {
    const copy = [...prev];
    copy[index] = text;
    return copy;
  });
}
function handleDelete(indexToDelete) {
  setData(prev => prev.filter((_, index) => index !== indexToDelete));
}

useImperativeHandle(ref, () => ({
    getData: () => (data),
    loadData:(data) => setData(data)
  }));

  return (
    <div className="list-on-edit">


      <svg style={{ display: "none" }}>
          <use href="#icon-expand">
            <symbol id="icon-expand" viewBox="0 -960 960 960">
              <path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69t21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08t-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92T480-372.92"></path>
            </symbol>
          </use>
      </svg>
      <svg style={{ display: "none" }}>
        <symbol id="icon-plus" viewBox="0 -960 960 960">
          <path
            d="M480 -720 L480 -240 M240 -480 L720 -480"
            stroke="currentColor"
            strokeWidth="88"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </symbol>
      </svg>
      

    {Daughter != null ?  
    <div style={{display:"flex", alignItems:"start", justifyContent:"start"}}>
      <div onClick={handleClick} style={{display:"flex", alignItems:"start", justifyContent:"start"}}>
          <svg  width="24" height="24" style={{minWidth:"16px", minHeight:"16px", marginTop:"5px",transform: isVisible ? "scaleY(-1)" : "scaleY(1)",transformOrigin: "center center"}}>
            <use href="#icon-expand"/>
          </svg>
      </div>
      <InputForm funct={handleNameChange} zstyle={"name-lesson-input"} defaultText={name}/>
    </div>
      :
    <div onClick={handleClick} style={{display:"flex", alignItems:"start", justifyContent:"start"}}>
      <svg  width="24" height="24" style={{minWidth:"16px", minHeight:"16px", marginTop:"5px",transform: isVisible ? "scaleY(-1)" : "scaleY(1)",transformOrigin: "center center"}}>
        <use href="#icon-expand"/>
      </svg>

      <div>
        <h2>{Name}</h2>
      </div>
    </div>
    }
    <div onClick={addItem}>
      <svg width="20" height="20" style={{position:"absolute", right:"1%", top:"10px"}}>
        <use href="#icon-plus" />
      </svg>
    </div>
      {isVisible && <div style={{display:"flex", width:"100%"}}>

        <ul className="list" style={{flex:"1"}}>
        {data?.map((item,index)=>(
          <div key={index}>
            {NestedList != null ? <ListOnEdit Daughter={"true"}/> : <InputFormForList funct={handleChange} index={index} item={item}/>}
            <span style={{color:"#860000ff", marginTop:"1 5px"}} onClick={() => handleDelete(index)}>Удалить</span>
          </div>
        ))}
        </ul>
        </div>}
    </div>
  );
});

export default ListOnEdit;