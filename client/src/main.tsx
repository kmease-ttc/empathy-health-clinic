import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initPhoneTracking } from "./lib/phoneTracking";

createRoot(document.getElementById("root")!).render(<App />);

// Initialize phone click tracking after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initPhoneTracking();
});

// Re-initialize on route changes (for SPAs)
window.addEventListener('popstate', () => {
  setTimeout(initPhoneTracking, 100);
});
