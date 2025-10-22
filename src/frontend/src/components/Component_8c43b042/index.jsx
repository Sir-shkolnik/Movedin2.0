import { Button } from "@mui/base";
import Component_4a8e8d82 from "../Component_4a8e8d82";
import "./style.css";

function Component_8c43b042() {
  const handleGetQuote = () => {
    // For now, we'll just show an alert. In a real app, this would redirect to a quote form
    alert('Get a Quote functionality - This would redirect to a quote form in a real application');
  };

  return (
    <div className="div-style-fa487055">
      <div className="div-style-34f3e1d4">
        <div className="div-style-29e9a8c1">
          <div className="div-style-fb27cf62">
            <img src="/assets/image_369206ff.png" alt="" className="img-style-78164884" />
          </div>
        </div>
        <div className="div-style-94120918">
          <Component_4a8e8d82 />
        </div>
        <div className="div-style-f5ad1ce3">
          {/* Button Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
          <Button className="Button-style-e590188e" onClick={handleGetQuote}>Get a Quote</Button>
        </div>
      </div>
    </div>
  );
}

export default Component_8c43b042;
