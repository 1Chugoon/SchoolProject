import { Outlet, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import config from "../../config.json"
import ConfirmDialog from "../../Components/ConfirmDialog";

function SettingsPage() {
  const [person,setPerson] = useState()

  const [open,setOpen] = useState()

  useEffect(() => {
    axios.get(config.BaseURL +"/me", {
      withCredentials: true
    })
    .then((res) => {setPerson(res?.data); })
    .catch((err) => {})
}, [])

  const [photo, setPhoto] = useState(null);

useEffect(() => {
  const fetchUserAndAvatar = async () => {
    try {
      const avatarResponse = await axios.get(
        `${config.BaseURL}/users/${person?.Id}/avatar`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(avatarResponse.data);
      setPhoto(imageUrl);

    } catch (error) {}
  };

  fetchUserAndAvatar();

  return () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }
  };
}, [person?.Id]);

const handleLogout = async () => {
  try {
    await axios.post(
      config.BaseURL + "/users/logout",
      {},
      { withCredentials: true }
    );

    window.location.href = "/";
  } catch (e) {}
};

  const navigate = useNavigate();
  return (
    <div className="settings-page-root">
      <div className="settings-table">
        <div className="left-panel">
          <div className="avatar"><img src={photo} alt="" /></div>
          <span className="settings-avatar-name">{person?.Name}</span>

          <div className="menu">
            <button onClick={()=>navigate("/user/"+person?.Id)}>Просмотр профиля</button>
            <button onClick={()=>navigate("/settings/profile")}>Профиль</button>
            <button onClick={()=>navigate("/settings/photo")}>Фото</button>
            <button onClick={()=>navigate("/settings/security")}>Безопасность</button>
            <button onClick={()=>navigate("/settings/courses")}>Курсы</button>
            {person?.Role == "Author" && (
              <button onClick={()=>navigate("/settings/created-courses")}>Созданные курсы</button>
            )}
            <button className="logout-btn" onClick={()=> setOpen(true)}>Выйти</button>
          </div>
        </div>

        <div className="settings-main-area">
          <Outlet/>
        </div>

        <ConfirmDialog
        open={open}
        message="Выйти из аккаунта ?"
        onCancel={() => setOpen(false)}
        onConfirm={handleLogout}
      />
      </div>
    </div>
  );
}

export default SettingsPage;