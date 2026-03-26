import { useState } from "react";

import { toast } from "react-toastify";

import MainBtns from "../Components/Buttons/MainBtns";
import InputForm from "../Components/Input/InputForm";
import AdditionalInformation from "../Components/TextComponents/AdditionalInformation";
import TitleText from "../Components/TextComponents/TitleText";

import config from "../config.json"
import axios from "axios";


function LoginPage({setAuth}) {
  const [email,setEmail] = useState();
  const [password, setPass] = useState();

  const Request = async () =>{
    try{ 
    await axios.post(config.BaseURL +"/auth/login", {
      email,
      password
    },{withCredentials: true})

    setAuth(true);
    toast.success("Успешная авторизация")
  }
  catch(err){
    if (err.response?.status === 500){
      toast.error("Ошибка сервера");
    }
    if(err.response?.status === 401){
      toast.error("Невереный email или пароль")
    }
    if(err.response?.status === 404){
      toast.error("Не найден пользователь");
    }
  }
  }


  return (
    <>
      <TitleText TextOnTitle={"Выполните вход чтобы продолжить"} MarginOnBot={"20px"}/>
      <InputForm TextPlaceholder="Адрес электронной почты" funct={setEmail}/>
      <InputForm TextPlaceholder={"Пароль"} funct={setPass} type={"password"}/>
      <MainBtns 
        Style={"purple-btn"} 
        Text={"Продолжить"} 
        Width={"80%"} 
        Height={56} 
        FontSize={"24px"} 
        FontWeight={"400"} 
        Padding={"0 20px"} 
        MarginTop={"20px"} 
        Funct={Request} 
      />
      <AdditionalInformation 
        FirstText={"Не зарегистрированы?"} 
        SecondText={"Регистрация"} 
        NavigateTo={"/join/register"}
      />
    </>
  );
}

export default LoginPage;