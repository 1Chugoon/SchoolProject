import { useEffect, useState } from "react";
import MainBtns from "../../Components/Buttons/MainBtns";
import InputForm from "../../Components/Input/InputForm";
import axios from "axios";
import config from "../../config.json"
import { toast } from "react-toastify";

function SecurityPage() {
  const [email, setEmail] = useState()
  const [newPassword, setNewPassword] = useState()
  const [retypeNewPassword, setRNewPassword] = useState()
  const [oldPassword,setOldPassword] = useState()

  const [user,setUser] = useState()
useEffect(()=>{

  axios.get(config.BaseURL +"/me", {
    withCredentials: true,
  })
  .then((res) => {setUser(res?.data);})
  .catch((err) => {toast.error("")})
  },[])
const saveChanges = () =>{
 try{
  if(newPassword !== retypeNewPassword && newPassword !== null) throw new Error("неверный пароль")
  
  axios.put(`${config.BaseURL}/users/${user.Id}/security`, {
    "oldPassword": oldPassword,
    "newPassword": newPassword,
    "newEmail": email
  },
  {withCredentials:true})
  .then(()=> toast.success("Успешно изменено"))
  .catch(()=>toast.error("Неверные данные"))
 }catch{
  toast.error("Несовпадение паролей")
 }
}
  return (
    <div className="page-root page-centered-column">

      <header className="page-header">
        <h2 className="header-title">Безопасность</h2>
        <span className="header-subtitle"></span>
      </header>

      <div className="page-body">
        {/*<div className="controls-row">
          <div className="basics">
            <span>Email:</span>
            <InputForm TextPlaceholder={"Email"} zstyle={"mini-input"} funct={setEmail}/>
          </div>
        </div>*/}

        <div className="controls-column">
          <div className="basics">
            <span>Password:</span>
            <InputForm TextPlaceholder={"New Password"} zstyle={"mini-input"} funct={setNewPassword} type={"password"}/>
            <InputForm TextPlaceholder={"Re-type new Password"} zstyle={"mini-input"} funct={setRNewPassword} type={"password"}/>
            <InputForm TextPlaceholder={"Old password"} zstyle={"mini-input"} funct={setOldPassword} type={"password"}/>
          </div>
          <MainBtns Style={"purple-btn"} Text={"Save"} Height={"40px"} Width={"100px"} Funct={saveChanges}/>
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;