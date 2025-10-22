import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="navigation">
      <p
        className={`nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}
        onClick={() => handleNavigation('/how-it-works')}
        style={{ cursor: 'pointer' }}
      >
        How it works
      </p>
      <p
        className={`nav-link ${location.pathname === '/blogs' ? 'active' : ''}`}
        onClick={() => handleNavigation('/blogs')}
        style={{ cursor: 'pointer' }}
      >
        Tips & Guides
      </p>
      <p
        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
        onClick={() => handleNavigation('/about')}
        style={{ cursor: 'pointer' }}
      >
        About Us
      </p>
    </div>
  );
}

export default Navigation;

