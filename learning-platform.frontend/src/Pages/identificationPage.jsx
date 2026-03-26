import { Outlet } from "react-router-dom";

import image from "../Files/auth.png"

function IdentificationPage() {
  
  return (
  <div className="container-ident">
    <div className="image-wrapper">
      <img src={image} alt="" />
    </div>
    <div className="content">
      <Outlet/>
    </div>
  </div>
  );
}

export default IdentificationPage;