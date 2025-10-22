import { useLocation } from "react-router-dom";
import SharedHeader from "../SharedHeader";
import SharedFooter from "../SharedFooter";
import "./style.css";

function Layout({ children }) {
  const location = useLocation();
  const isWizard = location.pathname.startsWith('/quote');
  return (
    <div className="layout-container">
      <SharedHeader />
      <main className="layout-main">
        {children}
      </main>
      {!isWizard && <SharedFooter />}
    </div>
  );
}

export default Layout;
