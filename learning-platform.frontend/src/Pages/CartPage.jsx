import { useEffect, useState} from "react";

import CourseCard from "../Components/CourseCard";
import MainBtns from "../Components/Buttons/MainBtns";

function CartPage() {

  const [courses, setCourses] = useState([]);
  const [price, setPrice] = useState();
  
  useEffect(() => {
      fetch(`/Files/Tests/UserCoursesTest.json`, { cache: "no-store" })
        .then(res => {
          if (!res.ok) throw new Error("Ничего не найдено");
          return res.json();
        }).then(datas => setCourses(datas))

      
    }, []);
  useEffect(() => {
    if (courses?.length > 0){
        var z = 0
        courses.forEach(el => {
          z += parseInt(el.price) || 0;
          console.log(el.price);
        });
        setPrice(z)
      }
  })


  return (
    <div className="cart-page">
      <h1>Тележка</h1>
      <span>В корзине предметов: {courses?.length}</span>
      <div className="buy-menu">
        <span style={{fontSize:"18px", color:"#595c73"}}>Итого:</span>
        <span className="price">₺{price}</span>
        <div>
          <MainBtns Style={"purple-btn"} Text={"перейти к оплате"} Width={"250px"} Height={"50px"}/>
          <MainBtns Style={"null-btn"} Text={"очистить всё"} Width={"250px"} Height={"50px"}/>
        </div>
      </div>
      <div className="courses">
        <ul>
            {courses.map((item,index)=>(
              <li>
                <CourseCard key={index} courseInfo={item}/>
                <span>Удалить</span>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}

export default CartPage;