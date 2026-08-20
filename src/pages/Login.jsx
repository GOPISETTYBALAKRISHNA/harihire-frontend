import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function Login({
  setIsLoggedIn,
  setIsAdminLoggedIn
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    // Basic validation
    if (!email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!password) {
      alert("Please enter password.");
      return;
    }

    try {

      setLoading(true);

      console.log("=================================");
      console.log("LOGIN REQUEST");
      console.log("EMAIL:", email.trim());
      console.log("=================================");


      // =================================================
      // LOGIN API
      // =================================================

      const response = await api.post(
        "/users/login",
        {
          email: email.trim().toLowerCase(),
          password: password
        }
      );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      // =================================================
      // TOKEN CHECK
      // =================================================

      if (
        !response.data ||
        !response.data.token
      ) {

        alert(
          "Login failed. Token not received from server."
        );

        return;
      }


      // =================================================
      // USER DATA
      // =================================================

      const userData =
        response.data.user
          ? response.data.user
          : null;


      if (!userData) {

        alert(
          "Login failed. User data not received."
        );

        return;
      }


      console.log(
        "LOGIN USER:",
        userData
      );

      console.log(
        "USER ROLE:",
        userData.role
      );


      // =================================================
      // NORMALIZE ROLE
      // =================================================

      const role =
        userData.role
          ? userData.role
              .toString()
              .trim()
              .toUpperCase()
          : "";


      console.log(
        "NORMALIZED ROLE:",
        role
      );


      // =================================================
      // SAVE TOKEN
      // =================================================

      localStorage.setItem(
        "token",
        response.data.token
      );


      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );


      // =================================================
      // ADMIN LOGIN
      // =================================================

      if (role === "ADMIN") {

        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        localStorage.removeItem(
          "isLoggedIn"
        );


        setIsAdminLoggedIn(true);
        setIsLoggedIn(false);


        alert(
          "Admin Login Successful"
        );


        navigate(
          "/admin/dashboard"
        );


        return;
      }


      // =================================================
      // NORMAL USER LOGIN
      // =================================================

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.removeItem(
        "adminLoggedIn"
      );


      setIsLoggedIn(true);
      setIsAdminLoggedIn(false);


      // =================================================
      // RECRUITER LOGIN
      // =================================================

      if (role === "RECRUITER") {

        console.log(
          "RECRUITER LOGIN SUCCESS"
        );


        alert(
          "Recruiter Login Successful"
        );


        navigate(
          "/recruiter-dashboard"
        );


        return;
      }


      // =================================================
      // JOB SEEKER LOGIN
      // =================================================

      if (role === "JOB_SEEKER") {

        console.log(
          "JOB SEEKER LOGIN SUCCESS"
        );


        alert(
          "Login Successful"
        );


        navigate(
          "/jobs"
        );


        return;
      }


      // =================================================
      // UNKNOWN ROLE
      // =================================================

      console.error(
        "UNKNOWN USER ROLE:",
        userData.role
      );


      alert(
        "Unknown user role: " +
        userData.role
      );

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "================================="
      );


      // =================================================
      // SERVER RESPONSE ERROR
      // =================================================

      if (error.response) {

        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );


        const serverMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : `error.response.data?.message` ||
              `error.response.data?.error` ||
              "Login failed.";


        // 400
        if (
          error.response.status === 400
        ) {

          alert(
            serverMessage
          );

        }

        // 401
        else if (
          error.response.status === 401
        ) {

          alert(
            "Invalid Email or Password"
          );

        }

        // 403
        else if (
          error.response.status === 403
        ) {

          alert(
            "Access denied. Please check your account."
          );

        }

        // 404
        else if (
          error.response.status === 404
        ) {

          alert(
            "Login API not found. Check /users/login endpoint."
          );

        }

        // 500
        else if (
          error.response.status >= 500
        ) {

          alert(
            "Server error. Please check Spring Boot backend."
          );

        }

        // Other
        else {

          alert(
            serverMessage
          );

        }

      }

      // =================================================
      // NO SERVER RESPONSE
      // =================================================

      else if (error.request) {

        console.error(
          "NO SERVER RESPONSE:",
          error.request
        );


        alert(
          "Unable to connect to server. Please make sure Spring Boot backend is running on port 8085."
        );

      }

      // =================================================
      // REQUEST ERROR
      // =================================================

      else {

        console.error(
          "REQUEST ERROR:",
          error.message
        );


        alert(
          "Login error: " +
          error.message
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box",
        backgroundColor: "#f5f7fa"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.10)",
          boxSizing: "border-box"
        }}
      >

        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          Login
        </h2>


        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600"
            }}
          >
            Email
          </label>


          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            disabled={loading}
            autoComplete="email"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "15px"
            }}
          />


          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              marginTop: "18px",
              marginBottom: "7px",
              fontWeight: "600"
            }}
          >
            Password
          </label>


          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            disabled={loading}
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontSize: "15px"
            }}
          />


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "12px",
              backgroundColor:
                loading
                  ? "#90caf9"
                  : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>


          {/* FORGOT PASSWORD */}

          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
            disabled={loading}
            style={{
              display: "block",
              margin: "16px auto 0",
              background: "none",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline"
            }}
          >
            Forgot Password?
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;