import { useEffect, useState } from "react";


function TypingText({Text}) {
  const text = "Интересный факт\n" + Text
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 90);

    return () => clearInterval(interval);
  }, []);

    return (
    <div className="typing-container">
      <span className="typing-text">{displayedText}</span>
      <span className="cursor" />
    </div>
  );
}


export default TypingText;