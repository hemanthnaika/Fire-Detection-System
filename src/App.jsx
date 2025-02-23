import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard.jsx";
import History from "./pages/history.jsx"; // Assuming you have a History component
import Navbar from "./layout/navbar";
import { bg } from "./assets/images/index.js";
import Footer from "./layout/footer.jsx";

export default function App() {
  return (
    <main
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Black overlay with 50% opacity */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          opacity: 0.8,
          zIndex: 0,
        }}
      ></div>

      <Router>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar fireDetected={false} />
          <div className="px-5 md:px-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </main>
  );
}
