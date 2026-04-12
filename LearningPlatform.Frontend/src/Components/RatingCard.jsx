import StarRating from "./Rating/StarRatingByUser";
import ShowText from "./ShowText";

function RatingCard({CommentText, Rating, User = {name:"null", image:"/Files/png-people.png"}}) {
 
  const defphoto = "/Files/png-people.png";
  const userImage = User.image || defphoto;
  return (
    <div className="rating-card">
      <div style={{display:"flex", justifyContent:"center", marginBottom:"1rem"}}>
        <img src={userImage} alt="Photo" width={60} height={60}/>
        <div style={{display:"flex", flexDirection:'column'}}>
          <span>{User.name}</span>
          <StarRating rating={Rating}/>
        </div>
      </div>
      <ShowText text={CommentText}/>
    </div>
  );
}

export default RatingCard;