import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import config from "../config.json";

function MiniUser({userId}) {
  const navigate = useNavigate()

  const [photo, setPhoto] = useState(null);

useEffect(() => {
  const fetchUserAndAvatar = async () => {
    try {
      const avatarResponse = await axios.get(
        `${config.BaseURL}/users/${userId}/avatar`,
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
}, [userId]);

  return (
    <div className="mini-user" onClick={()=>navigate("/settings/profile")}>
      <img src={photo} alt="" />
    </div>
  );
}

export default MiniUser;