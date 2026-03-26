import { useState } from "react";

function ShowText({ text = "", maxLength = 100 }) {
  const [showFull, setShowFull] = useState(false);
  
  const isLong = text.length > maxLength;
  const displayedText = showFull ? text : text.slice(0, maxLength) + (isLong ? "..." : "");
  
  
  
  
  return (
    <div style={{ maxWidth: "400px", lineHeight: "1.5" }}>
      <p className="description-text">{displayedText}</p>

      {isLong && (
        <button
          onClick={() => setShowFull(!showFull)}
          style={{
            background: "none",
            border: "none",
            color: "var(--purple-btn-style-color)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {showFull ? "Свернуть" : "Показать всё"}
        </button>
      )}
    </div>
  );
}

export default ShowText;