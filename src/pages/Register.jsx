import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

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

    <div
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >

      <h2 style={{ textAlign: "center" }}>
        Register
      </h2>

      <input
        type="text"
        placeholder="Enter Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      

      <button
        onClick={handleRegister}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Register
      </button>

    </div>

  );

}

export default Register;