import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


import MainBtns from "../Buttons/MainBtns";

import searchIcon from "../../Files/Search.png";
import cartIcon from "../../Files/Shopping cart.png";
import config from "../../config.json";
import MiniUser from "../MiniUser";

function Header({isAuth}) {
  const name = config.nameOfSite;
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(config.BaseURL + "/me", { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        toast.error("Ошибка при получении данных пользователя");
      }
    };
    if (isAuth === true) {
      fetchUserData();
    }
  }, [isAuth]);

  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo" onClick={()=>navigate("/")}>{name}</div>
      {/*<div className="search-bar">
        <img src={searchIcon} alt="search" className="search-icon" />
        <input type="text" placeholder="Поиск" className="search-input" />
      </div>*/}
      <div><h4>Добро пожаловать на учебный сайт</h4></div>
      <div className="actions">
        {/*<button className="icon-btns shopping-cart-btn">
          <img src={cartIcon} alt="shopping-cart" className="icons shopping-cart-icon" onClick={() => navigate("/cart")} />
        </button>*/}
        {isAuth ?
        <MiniUser userId={userData?.Id || null}/>
        :
        <div>
          <MainBtns Text={"Войти"} FontSize={14} Style={"null-btn"} NavigateTo={"/join/login"}/>
          <MainBtns Text={"Регистрация"} FontSize={14} Style={"purple-btn"} NavigateTo={"/join/register"}/>
        </div>}
      </div>
    </header>
  );
}

export default Header;