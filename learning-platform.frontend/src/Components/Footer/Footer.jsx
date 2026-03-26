import GitHub from  "../../Files/Github.png"
import email from "../../Files/At sign.png"
import config from "../../config.json"

function Footer() {
  return (
    <footer className="footer">
      <button className="icon-btns">
        <img src={GitHub} alt="Github" className="icons" />
        GitHub
      </button>
      <button className="icon-btns">
        <img src={email} alt="Email" className="icons"/>
        {config.email}
      </button>
    </footer>
  );
}

export default Footer;