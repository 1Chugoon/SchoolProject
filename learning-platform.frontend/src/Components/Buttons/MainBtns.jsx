import { useNavigate } from "react-router-dom";

function MainBtns({Text,Funct,NavigateTo, FontSize, Style, Width, Height, FontWeight, Padding, Margin,MarginTop, ZIndex}) {
  
  const navigate = useNavigate();
  return (
    <div className={"main-btn "+Style} style={{fontSize:FontSize,
    width:Width,
    height:Height,
    fontWeight:FontWeight,
    padding:Padding,
    margin:Margin,
    marginTop:MarginTop,
    zIndex:ZIndex
  }}
    
    onClick={()=>{NavigateTo ? navigate(NavigateTo) : Funct?.()}}
    >
      {Text}
    </div>
  );
}

export default MainBtns;