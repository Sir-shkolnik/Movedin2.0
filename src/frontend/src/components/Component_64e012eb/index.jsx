import { Input } from "@mui/base";
import Component_d7c0a0dc from "../Component_d7c0a0dc";
import SvgIcon_a40c05a3 from "./icons/SvgIcon_a40c05a3";
import SvgIcon_f803cf46 from "./icons/SvgIcon_f803cf46";
import SvgIcon_9ff3628c from "./icons/SvgIcon_9ff3628c";
import "./style.css";

function Component_64e012eb() {
  return (
    <div className="div-style-6e9ab78">
      <div className="div-style-736db851">
        <div className="div-style-5a6e9f21">
          <SvgIcon_a40c05a3 className="div-style-7a1d6f27" />
          <div className="div-style-36f4db08">
            <p className="p-style-b6285630">Find a quiet spot to sit. You may also lie down on your bed or the couch if you prefer.</p>
          </div>
        </div>
        <div className="div-style-5a6e9f21">
          <SvgIcon_f803cf46 className="div-style-7a1d6f27" />
          {/* Input Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
          <Input
            slotProps={{ root: { className: "Input-style-5a05b367" }, input: { className: "input-style-e0c370c1 input-style-e0c370c1::placeholder", placeholder: "Close your eyes.", type: "text" } }}
          />
        </div>
        <Component_d7c0a0dc />
        <div className="div-style-5a6e9f21">
          <SvgIcon_9ff3628c className="div-style-7a1d6f27" />
          <div className="div-style-36f4db08">
            <p className="p-style-b6285630">If your thoughts start to wander (which they inevitably will), gently redirect your attention back to your breath.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component_64e012eb;
