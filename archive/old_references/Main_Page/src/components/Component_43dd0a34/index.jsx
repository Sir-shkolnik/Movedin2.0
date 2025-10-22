import { useNavigate } from "react-router-dom";
import Component_bd20c5a7 from "../Component_bd20c5a7";
import "./style.css";

function Component_43dd0a34() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/blog/3');
  };

  return (
    <div className="div-style-3c4a6a94" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src="/assets/image_3ea0c39a.jpeg" className="img-style-cc5ff165" />
      <Component_bd20c5a7 />
    </div>
  );
}

export default Component_43dd0a34;
