import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY;

      if (current > lastScroll) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScroll(current);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  function logout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <header className={`topbar ${show ? "show" : "hide"}`}>
      {/* Wrap the logo with Link → Feed page */}
      <Link to="/feed">
        <img src="/logo1.png" className="logo" alt="logo" style={{ cursor: "pointer" }} />
      </Link>

      {user ? (
        <nav className="nav">
          <NavLink className="navlink" to="/feed">Feed</NavLink>
          <NavLink className="navlink" to="/period">Period</NavLink>
          <NavLink className="navlink" to="/selfcare">Self-Care</NavLink>
          <NavLink className="navlink" to="/chatbot">Chatbot</NavLink>
          <NavLink className="navlink" to="/profile">Profile</NavLink>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </nav>
      ) : (
        <nav className="nav">
          <NavLink className="navlink" to="/login">Login</NavLink>
          <NavLink className="navlink" to="/register">Register</NavLink>
        </nav>
      )}
    </header>
  );
}
