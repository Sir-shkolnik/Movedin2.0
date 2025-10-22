import TrustedBy from "../TrustedBy";
import "./style.css";

function SharedFooter() {
  return (
    <footer className="footer">
      <TrustedBy />
      <div className="footer-content">
        <p className="footer-copyright">© 2025 MovedIn. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default SharedFooter;
