import { useNavigate } from "react-router-dom";
import "./style.css";

function BlogCard_BestNeighbourhoodsGTA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/blog/best-neighbourhoods-families-gta');
  };

  return (
    <div className="blog-card-neighbourhoods" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img 
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop" 
        alt="Best GTA Neighbourhoods for Families" 
        className="blog-card-image"
      />
      <div className="blog-card-content">
        <h3 className="blog-card-title">The 10 Best Neighbourhoods for Families in the GTA</h3>
        <p className="blog-card-excerpt">
          Discover the top 10 family-friendly neighbourhoods in the Greater Toronto Area. Expert guide to finding the perfect community for your family's move with schools, parks, and amenities.
        </p>
        <div className="blog-card-meta">
          <span className="blog-date">Oct 22, 2025</span>
          <span className="blog-read-time">12 min read</span>
        </div>
        <div className="blog-card-tags">
          <span className="tag">GTA Moving</span>
          <span className="tag">Family Neighbourhoods</span>
          <span className="tag">Toronto Suburbs</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard_BestNeighbourhoodsGTA;



