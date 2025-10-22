import Component_700ad56 from "../Component_700ad56";
import { theme } from "../../theme";
import "./style.css";

function Component_e1e0bc43({ loop_86cb46b6 }) {
  const style_cc8a0155 = [
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_98D205BD, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
    { style_div_border_2bad5d3: theme.others.BORDER_7817FF61, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_98D205BD, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
    { style_div_border_2bad5d3: theme.others.BORDER_7817FF61, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_98D205BD, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
    { style_div_border_2bad5d3: theme.others.BORDER_7817FF61, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_6BDCC29, style_p_color_2c822f5: theme.colors.COLOR_98D205BD },
  ];
  return (
    <div className="div-style-d0098c97">
      {loop_86cb46b6.map((data, index) => {
        return <Component_700ad56 {...data} key={index} {...style_cc8a0155[index]} />;
      })}
    </div>
  );
}

export default Component_e1e0bc43;
