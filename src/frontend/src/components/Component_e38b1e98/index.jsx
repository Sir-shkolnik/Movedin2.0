import Component_700ad56 from "../Component_700ad56";
import { theme } from "../../theme";
import "./style.css";

function Component_e38b1e98({ loop_bbab50be }) {
  const style_e571a2ca = [
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_98D205BD, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
    { style_div_border_2bad5d3: theme.others.BORDER_7817FF61, style_p_color_2c822f5: theme.colors.COLOR_98D205BD },
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_6BDCC29, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
    { style_div_border_2bad5d3: theme.others.BORDER_CC9FDBCB, style_div_background_color_2bad5d3: theme.colors.BACKGROUND_COLOR_6BDCC29, style_p_color_2c822f5: theme.colors.COLOR_957665DF },
  ];
  return (
    <div className="div-style-d0098c97">
      {loop_bbab50be.map((data, index) => {
        return <Component_700ad56 {...data} key={index} {...style_e571a2ca[index]} />;
      })}
    </div>
  );
}

export default Component_e38b1e98;
