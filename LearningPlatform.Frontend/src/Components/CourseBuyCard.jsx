import MainBtns from "./Buttons/MainBtns";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../config.json"

function CourseBuyCard({Price, Description, Id}) {
  const  Request = async () =>{
    try{
      await axios.post(config.BaseURL +"/courses/"+Id+"/purchase", {
      },{withCredentials: true})

      toast.success("Успешная покупка")
  }   catch(err){
      switch(err.response?.status){
        case 409: toast.error("Курс уже куплен");break;
        case 500: toast.error("Ошибка сервера");break;
      }
    }
  }
  return (
    <div className="course-buy-card">
      <h3 className="course-buy-price">{Price}</h3>
      <div className="course-buy-btns">
        {/*<MainBtns Text={"Добавить в корзину"} Style={"purple-btn"}/>*/}
        <MainBtns Text={"Купить сейчас"} Style={"purple-btn"} Funct={Request}/>
      </div>
     {/*<p className="course-buy-text">Этот курс включает в себя:
        <span>{Description}</span>
      </p>*/}
    </div>
  );
}

export default CourseBuyCard;