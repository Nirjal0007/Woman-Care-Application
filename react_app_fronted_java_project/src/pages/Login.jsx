import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const found = await loginUser(username, password);
      if (!found) return setErr("Invalid credentials");
      localStorage.setItem("currentUser", JSON.stringify(found));
      navigate("/feed");
    } catch (error) {
      console.error(error);
      setErr("Server error");
    }
  }

  return (
    <section className="authwrap">
      <form className="card form auth" onSubmit={submit}>
        <h1 className="h1">Login</h1>
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button className="btn primary" type="submit">Login</button>
        <div className="muted">No account? <Link to="/register">Register</Link></div>
      </form>
    </section>
  );
}
