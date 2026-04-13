import { Route, Routes, useLocation } from "react-router-dom";
import { useState,useEffect  } from "react";

import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import IdentificationPage from "./Pages/identificationPage";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";

import "./style.css"
import config from "./config.json";

import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import CoursePage from "./Pages/Courses/CoursePage";
import UserPage from "./Pages/User/UserPage";
import SettingsPage from "./Pages/User/SettingsPage";
import ProfilePage from "./Pages/User/ProfilePage";
import PhotoPage from "./Pages/User/PhotoPage";
import SecurityPage from "./Pages/User/SecurityPage";
import MainPage from "./Pages/MainPage";
//import CartPage from "./Pages/CartPage";
import EditCoursePage from "./Pages/Courses/EditCoursePage";
import EditLessonPage from "./Pages/Courses/EditLessonPage";
import LearnCoursePage from "./Pages/Courses/LearnCoursePage";
import CoursesUsPage from "./Pages/User/CoursesUsPage";
import CreatedCoursesPage from "./Pages/User/CreatedCoursesPage";
import ConfirmEmailPage from "./Pages/ConfirmEmailPage";

function App() {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  const path = location.pathname;

  const hideHeaderPaths = ["/learn"];
  const hideFooterPaths = ["/learn"];

  const hideHeader = hideHeaderPaths.some(p => path.includes(p));
  const hideFooter = hideFooterPaths.some(p => path.includes(p));

  useEffect(() => {
    axios.get(config.BaseURL +"/me", {
      withCredentials: true
    })
    .then(() => setIsAuth(true))
    .catch(() => setIsAuth(false))
}, [])

  return (
    <div className="App">
      {!hideHeader && <Header isAuth={isAuth}/>}
      <div style={{flex:"1", height:"100vh", display:"flex"}}>
          <div style={{position: 'relative',zIndex:"1",minHeight:"100%",minWidth:"100%"}}>
            <Routes>
              <Route path="/" element={<MainPage/>}/>
              <Route path="/join" element={<IdentificationPage/>}>
                <Route path ="login" element={<LoginPage setAuth={setIsAuth}/>}/>
                <Route path = "register" element={<RegisterPage/>}/>
              </Route>
              <Route path="/course">
                <Route path=":id" element={<CoursePage/>}/>
                <Route path=":id/edit" element={<EditCoursePage/>}/>
                <Route path=":id/edit/:idLesson" element={<EditLessonPage/>}/>
                <Route path=":id/learn/:idLesson" element={<LearnCoursePage/>}/>
              </Route>
              <Route path="/user/:id" element={<UserPage/>}/>
              <Route path="/settings" element={<SettingsPage Auth={isAuth}/>}>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="photo" element={<PhotoPage/>}/>
                <Route path="security" element={<SecurityPage/>}/>
                <Route path="courses" element={<CoursesUsPage/>}/>
                <Route path="created-courses" element={<CreatedCoursesPage/>}/>
              </Route>
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              {/*<Route path="cart" element={<CartPage/>}/>*/}
            </Routes>
          </div>
      </div>
      {!hideFooter && <Footer/>}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
