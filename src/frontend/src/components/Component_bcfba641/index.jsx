import Component_4caf2151 from "../Component_4caf2151";
import { theme } from "../../theme";
import "./style.css";

function Component_bcfba641({ loop_b4826e7d }) {
  const style_c36f46ae = [
    { style_div_border_2bad5d3: theme.others.BORDER_7817FF61 },
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB, style_p_opacity_2c822f5: theme.others.OPACITY_168538 },
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB },
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB },
  ];
  return (
    <div className="div-style-d0098c97">
      {loop_b4826e7d.map((data, index) => {
        return <Component_4caf2151 {...data} key={index} {...style_c36f46ae[index]} />;
      })}
    </div>
  );
}

export default Component_bcfba641;
