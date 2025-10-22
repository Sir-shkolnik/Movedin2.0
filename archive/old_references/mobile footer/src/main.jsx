import React, { createRoot } from "react-dom/client";
import Component_a8cf8e3f from "./components/Component_a8cf8e3f";
const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <div style={{ display: "inline-block", width: "375px" }} data-ignore="used only for top most containter width">
    <Component_a8cf8e3f />
  </div>
);
