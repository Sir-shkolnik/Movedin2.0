import { useNavigate } from "react-router-dom";
import Component_aff76c73 from "../Component_aff76c73";
import "./style.css";

function Component_672189e1() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/blog/2');
  };

  return (
    <div className="div-style-3c4a6a94" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src="/assets/image_71ace889.jpeg" className="img-style-cc5ff165" />
      <Component_aff76c73 />
    </div>
  );
}

export default Component_672189e1;
