import { useNavigate } from "react-router-dom";
import "./style.css";

function Logo() {
  const navigate = useNavigate();

  return (
    <div className="logo-container" onClick={() => navigate('/')}>
      <img src="/assets/image_369206ff.png" alt="MovedIn Logo" className="logo-image" />
    </div>
  );
}

export default Logo;


