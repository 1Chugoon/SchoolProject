import { useEffect, useState } from "react";

import InputForm from "../../Components/Input/InputForm";
import MainBtns from "../../Components/Buttons/MainBtns";
import axios from "axios";
import config from "../../config.json"
import { toast } from "react-toastify";

function PhotoPage() {
  const [image, setImage] = useState(null);
  const [realImage, setRImage] = useState();
  const [us , setUser] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setRImage(file)
    } else {
      setImage(null);
    }
  };
    useEffect(() => {
axios.get(config.BaseURL +"/me", {
    withCredentials: true,
  })
  .then((res) => {setUser(res?.data);})
  .catch((err) => {toast.error("")})

},[]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const savePhoto = () =>{

    const formData = new FormData();
    formData.append("file", realImage);

    axios.post(`${config.BaseURL}/users/${us.Id}/avatar`,
      formData,
      {
        withCredentials:true,
        headers:{
        "Content-Type": "multipart/form-data",
      }}
    )
    .then(()=> delay(1000))
    .then(() =>window.location.reload())
    .catch((e)=>console.log(e))
}
  return (
    <div className="page-root page-centered-column">
      <header className="page-header">
        <h2 className="header-title">Photo</h2>
        <span className="header-subtitle">Add Photo</span>
      </header>

      <div className="photo-page-main">
        <div className="photo-preview-wrap">
          <div className="photo-preview-inner">
            <div className="image-preview">
              {image ? (
                <img src={image} alt="preview" />
              ) : (
                <div className="image-placeholder"></div>
              )}
            </div>
          </div>
        </div>

        <div className="photo-controls">
          <div className="file-input-row">
            <InputForm zstyle={"void"} type={"file"} TextPlaceholder={"image"} accept={"image/*"} Id={"InputImage"} funct={handleFileChange} />
            <label htmlFor="InputImage" className="image-input">Загрузить картинку</label>
          </div>
          <div className="photo-save-row">
            <MainBtns Style={"purple-btn"} Text={"Сохранить"} Funct={savePhoto}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoPage;