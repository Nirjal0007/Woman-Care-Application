import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!strongPassword.test(password)) {
      return setErr(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
    }

    try {
      const data = { name, username, password };
      const newUser = await registerUser(data);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      navigate("/upload-avatar");
    } catch (error) {
      console.error(error);
      setErr("Error creating account");
    }
  }

  return (
    <section className="authwrap">
      <form className="card form auth" onSubmit={submit}>
        <h1 className="h1">Register</h1>

        <input
          className="input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* 🔥 PASSWORD INPUT WITH EYE BUTTON */}
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showPassword ? "text" : "password"} // 👈 toggle type
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

              setPasswordStrength(
                e.target.value
                  ? strongPassword.test(e.target.value)
                    ? "Strong password"
                    : "Weak password"
                  : ""
              );
            }}
          />

          {/* 👁 Eye button */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: 14,
              color: "#555",
              userSelect: "none",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Live strength feedback */}
        {passwordStrength && (
          <p
            style={{
              color: passwordStrength === "Strong password" ? "green" : "red",
              marginTop: 5,
            }}
          >
            {passwordStrength}
          </p>
        )}

        {err && <div className="error">{err}</div>}

        <button className="btn primary" type="submit">
          Create Account
        </button>

        <div className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </section>
  );
}
