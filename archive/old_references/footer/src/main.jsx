import React, { createRoot } from "react-dom/client";
import Component_36fa5389 from "./components/Component_36fa5389";
const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <div style={{ display: "inline-block", width: "1440px" }} data-ignore="used only for top most containter width">
    <Component_36fa5389 />
  </div>
);
