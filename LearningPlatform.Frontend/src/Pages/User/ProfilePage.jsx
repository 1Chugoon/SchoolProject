import { useState, useRef, useEffect } from "react";

import MainBtns from "../../Components/Buttons/MainBtns";
import InputForm from "../../Components/Input/InputForm";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config.json"

function ProfilePage() {

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState();
  const textareaRef = useRef(null);
  const maxLength = 50;

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [text]);
  useEffect(()=>{

  axios.get(config.BaseURL +"/me", {
    withCredentials: true,
  })
  .then((res) => {setUser(res?.data);})
  .catch((err) => {toast.error("")})
  },[])

  const handlesave = ()=>{
    try{

    /*if(text.length > maxLength)throw new Error("Слишком длинный текст")*/

    axios.put(`${config.BaseURL}/users/${user.Id}`,{
      "name":name,
      "description": text
    },
    {withCredentials:true})
    }
    catch{
      toast.error("")
    }
  }

  return (
    <div className="page-root page-centered-column">

      <header className="page-header">
        <h2 className="header-title">Профиль</h2>
        <span className="header-subtitle"></span>
      </header>

      <div className="profile-container">
        <div className="basics">
          <span>Имя:</span>
          <InputForm TextPlaceholder={"Name"} zstyle={"mini-input"} defaultText={user?.Name} funct={setName}/> 
          {/*<InputForm TextPlaceholder={"LastName"} zstyle={"mini-input"}/>
          <InputForm TextPlaceholder={"Role"} zstyle={"mini-input"}/>*/}
        </div>

        <div className="biografy">
          <span>Биография:</span>
          <textarea className="text-area" ref={textareaRef} defaultValue={user?.Description} placeholder="Biografy" onChange={(e) => setText(e.target.value)}/>
        </div>

        {/*<div className="text-counter">
          {text.length} / {maxLength}
        </div>*/}
      </div>

      <div className="save-row">
        <MainBtns Style={"purple-btn"} Text={"Save"} Width={"30%"} Funct={handlesave} />
      </div>
    </div>
  );
}

export default ProfilePage;