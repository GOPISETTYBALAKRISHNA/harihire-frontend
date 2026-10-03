import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "../styles/Register.css";
import { Link } from "react-router-dom";
function Register() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const navigate = useNavigate();

  const handleRegister = async () => {

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

    }

  };

  return (

<div className="register-container">
  <div className="register-card">

    <h2 className="register-title">HariHire</h2>

    <p className="register-subtitle">
      Create your account and start your career journey
    </p>

    <input
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      className="register-input"
    />

    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="register-input"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="register-input"
    />

    <button
      onClick={handleRegister}
      className="register-btn"
    >
      Register
    </button>

    <div className="login-link">
      Already have an account?{" "}
      <Link to="/login">Login</Link>
    </div>

  </div>
</div>
  );

}

export default Register;