import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import PeriodTracker from "./pages/PeriodTracker";
import SelfCare from "./pages/SelfCare";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadAvatar from "./pages/UploadAvatar"; // <-- ADD THIS

function Protected({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="app">
      <NavBar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/feed" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✔️ NEW ROUTE - NOT PROTECTED */}
          <Route path="/upload-avatar" element={<UploadAvatar />} />

          {/* Protected Routes */}
          <Route path="/feed" element={<Protected><Feed /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/period" element={<Protected><PeriodTracker /></Protected>} />
          <Route path="/selfcare" element={<Protected><SelfCare/></Protected>} />
          <Route path="/chatbot" element={<Protected><Chatbot /></Protected>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">© {new Date().getFullYear()} WomanCare</footer>
    </div>
  );
}
