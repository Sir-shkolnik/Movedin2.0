import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

function Component_4a8e8d82() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="div-style-9feba4dc">
      <p 
        className="p-style-20ff3f6" 
        onClick={() => handleNavigation('/how-it-works')}
        style={{ cursor: 'pointer' }}
      >
        How it works
      </p>
      <p 
        className="p-style-feb17ba0" 
        onClick={() => handleNavigation('/blogs')}
        style={{ cursor: 'pointer' }}
      >
        Tips &amp; Guides
      </p>
      <p 
        className="p-style-20ff3f6" 
        onClick={() => handleNavigation('/about')}
        style={{ cursor: 'pointer' }}
      >
        About Us
      </p>
    </div>
  );
}

export default Component_4a8e8d82;
