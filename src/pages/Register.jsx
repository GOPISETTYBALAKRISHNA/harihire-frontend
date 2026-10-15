import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axiosConfig";
import "../styles/Register.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prevent duplicate registration requests
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await api.post("/users/register", {
        fullName,
        email,
        password,
        role,
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">HariHire</h2>

        <p className="register-subtitle">
          Create your account and start your career journey
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="register-input"
            required
            disabled={isProcessing}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            required
            disabled={isProcessing}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            required
            disabled={isProcessing}
          />

          <button
            type="submit"
            className="register-btn"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;