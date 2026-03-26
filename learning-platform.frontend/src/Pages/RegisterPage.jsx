import { useState } from "react";
import { toast } from "react-toastify";

import MainBtns from "../Components/Buttons/MainBtns";
import InputForm from "../Components/Input/InputForm";
import AdditionalInformation from "../Components/TextComponents/AdditionalInformation";
import TitleText from "../Components/TextComponents/TitleText";

import config from "../config.json"
import axios from "axios";

function RegisterPage() {

  const [email,setEmail] = useState();
  const [password, setPass] = useState();
  const [name,setName] = useState();

  
  const  Request = async () =>{
    try{
      await axios.post(config.BaseURL +"/auth/register", {
        email,
        password,
        name
      },{withCredentials: true})

      toast.success("Успешная регистрация")
  }
    catch(err){
    if (err.response?.status === 409) {
      toast.error("Email уже используется");
    }
    if (err.response?.status === 500){
      toast.error("Ошибка сервера");
    }
  }
}
  return (
    <>
      <TitleText TextOnTitle={"Регистрация по эл. почте"} MarginOnBot={"20px"} LetterSpacing={"1px"}/>
      <InputForm TextPlaceholder="Адрес электронной почты" funct={setEmail}/>
      <InputForm TextPlaceholder={"Отображаемое имя"} funct={setName}/>
      <InputForm TextPlaceholder={"Пароль"} funct={setPass} type={"password"}/>
      <MainBtns 
        Style={"purple-btn"} 
        Text={"Продолжить"} 
        Width={"90%"} 
        Height={56} 
        FontSize={"24px"} 
        FontWeight={"400"} 
        Padding={"0 20px"} 
        MarginTop={"20px"} 
        Funct={Request} 
      />
      <AdditionalInformation 
        FirstText={"Есть аккаунт?"} 
        SecondText={"Войти"} 
        NavigateTo={"/join/login"}
      />
    </>
  );
}

export default RegisterPage;