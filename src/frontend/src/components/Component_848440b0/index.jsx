import { useNavigate } from "react-router-dom";
import Component_1124834f from "../Component_1124834f";
import "./style.css";

function Component_848440b0() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/blog/1');
  };

  return (
    <div className="div-style-3c4a6a94" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src="/assets/image_56f7d181.jpeg" className="img-style-cc5ff165" />
      <Component_1124834f />
    </div>
  );
}

export default Component_848440b0;
