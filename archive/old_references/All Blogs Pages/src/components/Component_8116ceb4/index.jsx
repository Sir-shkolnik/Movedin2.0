import { Input } from "@mui/base";
import Component_563d1751 from "../Component_563d1751";
import SvgIcon_ba627af5 from "./icons/SvgIcon_ba627af5";
import SvgIcon_72fab5a from "./icons/SvgIcon_72fab5a";
import SvgIcon_12272aca from "./icons/SvgIcon_12272aca";
import "./style.css";

function Component_8116ceb4() {
  return (
    <div className="div-style-6e9ab78">
      <div className="div-style-736db851">
        <div className="div-style-5a6e9f21">
          <SvgIcon_ba627af5 className="div-style-7a1d6f27" />
          <div className="div-style-36f4db08">
            <p className="p-style-b6285630">Find a quiet spot to sit. You may also lie down on your bed or the couch if you prefer.</p>
          </div>
        </div>
        <div className="div-style-5a6e9f21">
          <SvgIcon_72fab5a className="div-style-7a1d6f27" />
          {/* Input Component starts here. We've generated code using MUI Base. See other options in "Component library" dropdown in Settings */}
          <Input
            slotProps={{ root: { className: "Input-style-5a05b367" }, input: { className: "input-style-e0c370c1 input-style-e0c370c1::placeholder", placeholder: "Close your eyes.", type: "text" } }}
          />
        </div>
        <Component_563d1751 />
        <div className="div-style-5a6e9f21">
          <SvgIcon_12272aca className="div-style-7a1d6f27" />
          <div className="div-style-36f4db08">
            <p className="p-style-b6285630">If your thoughts start to wander (which they inevitably will), gently redirect your attention back to your breath.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component_8116ceb4;
