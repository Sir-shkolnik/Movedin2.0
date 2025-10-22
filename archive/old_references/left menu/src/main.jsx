import React, { createRoot } from "react-dom/client";
import Component_6639b463 from "./components/Component_6639b463";
import { mockData } from "./mockData";
const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <div style={{ display: "inline-block", width: "240px" }} data-ignore="used only for top most containter width">
    <Component_6639b463 {...mockData} />
  </div>
);
