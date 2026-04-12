import GitHub from  "../../Files/Github.png"
import email from "../../Files/At sign.png"
import config from "../../config.json"

function Footer() {
  return (
    <footer className="footer">
      <a className="icon-btns" href = "https://github.com/1Chugoon/SchoolProject">
        <img src={GitHub} alt="Github" className="icons" />
        GitHub
      </a>
      {/*<button className="icon-btns">
        <img src={email} alt="Email" className="icons"/>
        {config.email}
      </button>*/}
    </footer>
  );
}

export default Footer;