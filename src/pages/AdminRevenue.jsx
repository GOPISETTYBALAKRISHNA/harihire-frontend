import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminRevenue() {

  const navigate = useNavigate();

  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadRevenue();

  }, [navigate]);


  // =========================
  // Load Revenue
  // =========================

  const loadRevenue = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/admin/ad-revenue");

      console.log(
        "ADMIN REVENUE:",
        response.data
      );

      setRevenue(response.data);

    } catch (error) {

      console.error(
        "Admin Revenue Error:",
        error
      );

      setError(
        "Failed to load revenue data."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Loading
  // =========================

  if (loading) {

    return (

      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h2>
          Loading Revenue...
        </h2>

      </div>

    );

  }


  // =========================
  // Error
  // =========================

  if (error) {

    return (

      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h3>
          {error}
        </h3>

        <button
          onClick={loadRevenue}
          style={buttonStyle}
        >
          Retry
        </button>

      </div>

    );

  }


  // =========================
  // No Data
  // =========================

  if (!revenue) {

    return (

      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h3>
          No revenue data available.
        </h3>

        <button
          onClick={() =>
            navigate("/admin/dashboard")
          }
          style={buttonStyle}
        >
          ← Dashboard
        </button>

      </div>

    );

  }


  // =========================
  // Main UI
  // =========================

  return (

    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh"
      }}
    >

      {/* =========================
          Header
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <h1>
          Admin - Ads Revenue
        </h1>

        <button
          onClick={() =>
            navigate("/admin/dashboard")
          }
          style={buttonStyle}
        >
          ← Dashboard
        </button>

      </div>


      {/* =========================
          Revenue Cards
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}
      >

        {/* Total Revenue */}

        <div style={cardStyle}>

          <h3>
            Total Ads Revenue
          </h3>

          <h1
            style={{
              color: "#2e7d32"
            }}
          >
            ₹ {revenue.totalRevenue || 0}
          </h1>

        </div>


        {/* Total Clicks */}

        <div style={cardStyle}>

          <h3>
            Total Clicks
          </h3>

          <h1>
            {revenue.totalClicks || 0}
          </h1>

        </div>


        {/* Total Impressions */}

        <div style={cardStyle}>

          <h3>
            Total Impressions
          </h3>

          <h1>
            {revenue.totalImpressions || 0}
          </h1>

        </div>


        {/* CTR */}

        <div style={cardStyle}>

          <h3>
            Click Through Rate
          </h3>

          <h1
            style={{
              color: "#1976d2"
            }}
          >
            {revenue.ctr || 0}%
          </h1>

        </div>

      </div>


      {/* =========================
          Revenue Details
      ========================= */}

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <h2>
          Revenue Information
        </h2>

        <p>
          <strong>Total Revenue:</strong>{" "}
          ₹ {revenue.totalRevenue || 0}
        </p>

        <p>
          <strong>Total Clicks:</strong>{" "}
          {revenue.totalClicks || 0}
        </p>

        <p>
          <strong>Total Impressions:</strong>{" "}
          {revenue.totalImpressions || 0}
        </p>

        <p>
          <strong>CTR:</strong>{" "}
          {revenue.ctr || 0}%
        </p>

      </div>


      {/* =========================
          Access Information
      ========================= */}

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#fff3cd",
          padding: "20px",
          borderRadius: "10px",
          border:
            "1px solid #ffe69c"
        }}
      >

        <h3>
          🔐 Admin Revenue Access
        </h3>

        <p>
          Ads Revenue is intended for
          Main Admin access only.
        </p>

        <p>
          Other recruiters or normal users
          should not have access to this
          section.
        </p>

      </div>

    </div>

  );

}


// =========================
// Card Style
// =========================

const cardStyle = {

  backgroundColor: "white",

  padding: "25px",

  borderRadius: "10px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)"

};


// =========================
// Button Style
// =========================

const buttonStyle = {

  padding: "10px 18px",

  backgroundColor: "#1976d2",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  fontSize: "14px"

};


export default AdminRevenue;