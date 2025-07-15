import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import UploadPage from "./UploadPage";

function AppRouter() {
  return (
    <Router basename="/chat-front">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
