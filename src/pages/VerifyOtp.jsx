
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function VerifyOtp() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    localStorage.getItem("resetEmail");

  const verifyOtp = async (e) => {

    e.preventDefault();

    if (!email) {
      alert("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits");
      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/password-reset/verify-otp",
        {
          email: email,
          otp: otp.trim(),
        }
      );

      console.log(
        "Verify OTP Response:",
        response.data
      );

      alert(
        response.data.message ||
          "OTP verified successfully"
      );

      // Save verification status
      localStorage.setItem(
        "otpVerified",
        "true"
      );

      navigate("/reset-password");

    } catch (error) {

      console.log(
        "Verify OTP Error:",
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
            "Invalid or expired OTP"
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
          Verify OTP
        </h2>

        <p style={textStyle}>
          Enter the 6-digit OTP sent to
          your email.
        </p>

        <p style={emailStyle}>
          {email || "No email found"}
        </p>

        <form onSubmit={verifyOtp}>

          <input
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <button
          type="button"
          onClick={() =>
            navigate("/forgot-password")
          }
          style={backButton}
        >
          ← Change Email
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
};

const emailStyle = {
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginBottom: "15px",
  boxSizing: "border-box",
  fontSize: "18px",
  textAlign: "center",
  letterSpacing: "5px",
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

export default VerifyOtp;
