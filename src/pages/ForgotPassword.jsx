
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  
const sendOtp = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    alert("Please enter your email");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post(
      "/password-reset/send-otp",
      {
        email: email.trim(),
      }
    );

    console.log(
      "OTP Response:",
      response.data
    );

    alert(
      response.data.message ||
        "OTP sent successfully"
    );

    localStorage.setItem(
      "resetEmail",
      email.trim()
    );

    navigate("/verify-otp");

  } catch (error) {
    console.log(
      "Send OTP Error:",
      error
    );

    if (error.response) {

      console.log(
        "Status:",
        error.response.status
      );

      console.log(
        "Data:",
        error.response.data
      );

      if (
        error.response.data &&
        error.response.data.message
      ) {
        alert(
          error.response.data.message
        );
      } else {
        alert(
          "Failed to send OTP"
        );
      }

    } else {
      alert(
        "Unable to connect to server"
      );
    }

  } finally {
    setLoading(false);
  }
};


  return (
    <div style={pageStyle}>

      <div style={boxStyle}>

        <h2 style={titleStyle}>
          Forgot Password
        </h2>

        <p style={textStyle}>
          Enter your registered email address
          to receive an OTP.
        </p>

        <form onSubmit={sendOtp}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send OTP"}
          </button>

        </form>

        <button
          onClick={() =>
            navigate("/login")
          }
          style={backButton}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f7fa",
  padding: "20px",
  boxSizing: "border-box",
};

const boxStyle = {
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.1)",
  boxSizing: "border-box",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "10px",
};

const textStyle = {
  textAlign: "center",
  color: "#666",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginBottom: "15px",
  boxSizing: "border-box",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};

const backButton = {
  width: "100%",
  marginTop: "15px",
  padding: "10px",
  backgroundColor: "transparent",
  color: "#1976d2",
  border: "none",
  cursor: "pointer",
};

export default ForgotPassword;
