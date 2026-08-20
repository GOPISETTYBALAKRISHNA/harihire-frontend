import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post(
        "/admin/login",
        {
          email: email,
          password: password
        }
      );
      console.log("ADMIN LOGIN RESPONSE:", response.data);

      const data = response.data;

      // Save admin token
      localStorage.setItem("token", data.token);

      // Save admin user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Separate admin login status
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      // Go to Admin Dashboard
      navigate("/admin/dashboard");

    } catch (error) {

      console.error("Admin Login Error:", error);

      if (error.response && error.response.data) {
        setError(
          typeof error.response.data === "string"
            ? error.response.data
            : "Invalid Admin Email or Password"
        );
      } else {
        setError("Unable to connect to server.");
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8"
      }}
    >

      <div
        style={{
          width: "380px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
        }}
      >

        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          Admin Login
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe5e5",
              color: "red",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter admin email"
            required
            style={inputStyle}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter admin password"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "10px"
            }}
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box"
};

export default AdminLogin;