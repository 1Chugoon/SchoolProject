import { useParams } from "react-router-dom";
import { useEffect, useState} from "react";
import axios from "axios";
import config from "../../config.json"

import MainBtns from "../../Components/Buttons/MainBtns";
import CourseCard from "../../Components/CourseCard";
import { toast } from "react-toastify";

function UserPage() {
  const {id} = useParams()
  const [me , setMe] = useState();
  const [user, setUser] = useState();
  const [userCourses, setCourses] = useState([]);

  useEffect(() => {
axios.get(config.BaseURL +"/users/"+id+"/courses", {
    withCredentials: true
  })
  .then((res) => {setCourses(res?.data);})
  .catch((err) => {toast.error("Не удалось загрузить курсы пользователя")})
 
  
  axios.get(config.BaseURL +"/users/"+id, {
    withCredentials: true
  })
  .then((res) => {setUser(res?.data)})
  .catch((err) => {toast.error("Не удалось загрузить информацию о пользователе")})
  }, []);


  const [photo, setPhoto] = useState(null);

useEffect(() => {
  const fetchUserAndAvatar = async () => {
    try {
      const avatarResponse = await axios.get(
        `${config.BaseURL}/users/${id}/avatar`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(avatarResponse.data);
      setPhoto(imageUrl);

    } catch (error) {}
  };
  const getUser = async ()=>{
    try {
      const user = await axios.get(`${config.BaseURL}/me`,
        {withCredentials:true})
      setMe(user.data);
      console.log(user);
    }catch{}
  }

  fetchUserAndAvatar();
  getUser();

  return () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }
  };
}, [id]);
  


  return (
    <div className="user-page">
      <div className="black-container">
        <div className="black-container-content">
          <p>{user?.Role}</p>
          <h1>{user?.Name}</h1>
        </div>
      </div>
      <div className="user-info-container">
        <img src={photo} alt="avatar"/>
        {String(me?.Id) === String(id) && (
    <MainBtns Text="Редактировать" Style="null-btn" NavigateTo="/settings/profile" />)}
      </div>
      {console.log(`me:${me?.Id}, id:${id}`)}

      <div className="user-courses-section">
        <h2 className="user-courses-title">Courses</h2>
        <ul className="courses-list">
          {userCourses.map((item,index)=>(
          <li key={index}>
            <CourseCard courseInfo={item}/>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserPage;