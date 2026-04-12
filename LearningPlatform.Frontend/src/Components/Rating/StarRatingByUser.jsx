import Star from "./Star";

function StarRating({rating,max = 5, SizeStar, Clr}) {
  return (
  <div style={{ display: "flex", gap: "4px" }}>
    {Array.from({ length: max }, (_, i) => {
        const starValue = rating - i;
        const fillPercent = starValue >= 1 ? 1 : starValue > 0 ? starValue : 0;
        return <Star key={i} fillPercent={fillPercent} Size={SizeStar} Color={Clr}/>;
      })}
  </div>
  );
}

export default StarRating;