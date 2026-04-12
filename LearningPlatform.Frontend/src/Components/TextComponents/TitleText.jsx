function TitleText({TextOnTitle, MarginOnBot, LetterSpacing}) {
  return (
    <p style={{display:"flex",
      justifyContent:"center",
      fontFamily:"Arial, sans-serif",
      fontSize:"32px",
      margin:"10px 10px 0px 10px",
      marginBottom: MarginOnBot,
      letterSpacing:LetterSpacing
      }}>
      
        {TextOnTitle}
    </p>
  );
}

export default TitleText;