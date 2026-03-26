import { useNavigate } from "react-router-dom";

function AdditionalInformation({FirstText, SecondText, NavigateTo}) {
  const navigate = useNavigate();
  if (NavigateTo === null) { NavigateTo = "/home"}
  return (
    <div style={{width:"500px",
    height:"100px", 
    backgroundColor:"#F9F9FF",
    margin:"30px",
    display:"flex",
    flexDirection:"row", 
    justifyContent:"center",
    alignItems: "center" 
    }}>
        <div style={{
          display:"flex",
          flexDirection:"row"}}>
            {FirstText}&nbsp;
            <div style={{color:"var(--purple-btn-style-color)", textDecorationLine:"underline", cursor:"pointer" }} 
            onClick={()=>navigate(NavigateTo)}>
              {SecondText}
            </div>
        </div>
    </div>
  );
}

export default AdditionalInformation;