
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function ResetPassword() {

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const email =
    localStorage.getItem("resetEmail");

  const otpVerified =
    localStorage.getItem("otpVerified");

  // =========================
  // Reset Password
  // =========================
  const resetPassword = async (e) => {

    e.preventDefault();

    if (!email) {
      alert(
        "Email not found. Please start again."
      );

      navigate("/forgot-password");
      return;
    }

    if (otpVerified !== "true") {
      alert(
        "Please verify OTP first."
      );

      navigate("/verify-otp");
      return;
    }

    if (!newPassword.trim()) {
      alert(
        "Please enter new password"
      );

      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/password-reset/reset-password",
          {
            email: email,
            newPassword: newPassword,
          }
        );

      console.log(
        "Reset Password Response:",
        response.data
      );

      alert(
        response.data.message ||
          "Password reset successfully"
      );

      // Clear reset data
      localStorage.removeItem(
        "resetEmail"
      );

      localStorage.removeItem(
        "otpVerified"
      );

      // Go to login
      navigate("/login");

    } catch (error) {

      console.log(
        "Reset Password Error:",
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
            "Failed to reset password"
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
          Reset Password
        </h2>

        <p style={textStyle}>
          Create a new password for
        </p>

        <p style={emailStyle}>
          {email || "No email found"}
        </p>

        <form
          onSubmit={resetPassword}
        >

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
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
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        <button
          type="button"
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

// =========================
// Styles
// =========================

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
  marginBottom: "5px",
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

export default ResetPassword;
