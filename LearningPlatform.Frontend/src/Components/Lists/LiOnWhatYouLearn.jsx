function LiOnWhatYouLearn({Text}) {
  return (
    <>
      <li>
        <div style={{display:"flex", alignItems:"flex-start", whiteSpace:"normal"}}>
          <svg width="16" height="16" style={{minWidth:"16px", minHeight:"16px", marginTop:"5px"}}>
            <use href="#check-icon"/>
          </svg>
          <div style={{marginLeft:"5px"}}>
          <span style={{whiteSpace:"pre-wrap", overflowWrap:"break-word", wordBreak:"break-word"}}>{Text}</span>
          </div>
        </div>
      </li>
    </>
  );
}

export default LiOnWhatYouLearn;