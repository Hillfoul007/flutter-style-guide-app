import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupAuthErrorHandler } from "./utils/authErrorHandler";

// Setup global auth error handler
setupAuthErrorHandler();

createRoot(document.getElementById("root")!).render(<App />);
