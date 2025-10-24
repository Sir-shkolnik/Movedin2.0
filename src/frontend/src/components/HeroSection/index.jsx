import { Button } from "@mui/base";
import { useNavigate } from "react-router-dom";
import "./style.css";

function HeroSection() {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    window.location.href = '/quote';
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-text-normal">Everything about moving is </span>
          <span className="hero-text-emphasis">hard! </span>
          <span className="hero-text-normal">That's about to change.</span>
        </h1>
        <p className="hero-description">
          We are here to guide you through your upcoming move, so you can focus on 
          enjoying the new home, instead of worrying about the hassle of moving.
        </p>
        <Button className="hero-cta-btn" onClick={handleGetQuote}>
          Get a moving quote
        </Button>
      </div>
      <div className="hero-illustration">
        <img 
          src="/moving-truck-illustration.png" 
          alt="Moving truck with boxes illustration" 
          className="hero-image"
        />
      </div>
    </section>
  );
}

export default HeroSection;

