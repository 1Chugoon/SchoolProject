import { useNavigate } from "react-router-dom";

import config from "../../config.json";
import MiniUser from "../MiniUser";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function HeaderOnLesson() {
  const name = config.nameOfSite;
  const text = `Удачной учёбы`

  const navigate = useNavigate();
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
      fetchUserData();
    }, []);

  return (
    <header>
      <div className="logo" onClick={()=>navigate("/")} style={{position:"absolute", left:"20px"}}>{name}</div>
      <div>{text}</div>
      <div style={{position:"absolute", right:"20px"}}>
        <MiniUser userId={userData?.Id || null}/>
      </div>
    </header>
  );
}

export default HeaderOnLesson;