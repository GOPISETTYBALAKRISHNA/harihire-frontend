import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axiosConfig";

import AdBanner from "../components/AdBanner";
import ImageAdManager from "../components/ImageAdManager";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const isAdminLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";


  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    selected: 0,
    interviews: 0,
    rejected: 0,
  });


  const [applications, setApplications] = useState([]);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    if (user) {
      loadDashboard();
    }

  }, []);


  const loadDashboard = async () => {

    try {

      const statsResponse =
        await api.get(
          `/dashboard/${user.id}`
        );

      setStats(statsResponse.data);


      const appResponse =
        await api.get(
          `/applications/user/${user.id}`
        );

      setApplications(
        appResponse.data
      );

    } catch (error) {

      console.log(error);

    }

  };


  // =====================================================
  // IF USER NOT FOUND
  // =====================================================

  if (!user) {

    return (

      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >

        <h2>
          Please Login First
        </h2>

        <button
          onClick={() =>
            navigate("/login")
          }
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >


      {/* =================================================
          IMAGE AD

          Dashboard lo Image Ad matrame popup ga
          display avutundi.

          Admin:
          ❌ No Image Ad

          Logged out:
          ❌ No Image Ad

          Normal User / Recruiter:
          ✅ Image Ad
      ================================================= */}

      {isLoggedIn && !isAdminLoggedIn && (

        <ImageAdManager
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
          trigger={true}
        />

      )}


      {/* =================================================
          WELCOME
      ================================================= */}

      <h1>
        Welcome {user.fullName} 👋
      </h1>


      <h2>
        HariHire Dashboard
      </h2>


      {/* =================================================
          BANNER AD

          Dashboard lo second ad type.

          VideoAd ikkada intentionally ledu.
      ================================================= */}

      <AdBanner />


      {/* =================================================
          DASHBOARD STATS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(5, minmax(150px, 1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >

        <Card
          title="💼 Jobs"
          value={stats.jobs}
        />

        <Card
          title="📄 Applied"
          value={stats.applications}
        />

        <Card
          title="✅ Selected"
          value={stats.selected}
        />

        <Card
          title="📅 Interviews"
          value={stats.interviews}
        />

        <Card
          title="❌ Rejected"
          value={stats.rejected}
        />

      </div>


      {/* =================================================
          MY PROFILE
      ================================================= */}

      <div
        style={{
          marginTop: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >

        <h2>
          👤 My Profile
        </h2>


        <div
          style={{
            marginTop: "20px",
          }}
        >

          <p>
            <b>Name :</b>{" "}
            {user.fullName}
          </p>


          <p>
            <b>Email :</b>{" "}
            {user.email}
          </p>


          <p>
            <b>Phone :</b>{" "}
            {user.phone ||
              "Not Updated"}
          </p>


          <p>
            <b>Education :</b>{" "}
            {user.education ||
              "Not Updated"}
          </p>


          <p>
            <b>Skills :</b>{" "}
            {user.skills ||
              "Not Updated"}
          </p>


          <p>
            <b>Experience :</b>{" "}
            {user.experience ||
              "Fresher"}
          </p>


          <p>
            <b>City :</b>{" "}
            {user.city ||
              "Not Updated"}
          </p>


          {/* =================================================
              EDIT PROFILE
          ================================================= */}

          <button
            onClick={() =>
              navigate("/profile")
            }
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor:
                "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>

        </div>

      </div>


      {/* =================================================
          BOTTOM BANNER AD

          Existing Banner functionality maintained.
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        <AdBanner />

      </div>

    </div>

  );
}


// =====================================================
// STAT CARD
// =====================================================

function Card({
  title,
  value,
}) {

  return (

    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.15)",
        border:
          "1px solid #e0e0e0",
        transition: "0.3s",
      }}
    >

      <h3
        style={{
          marginBottom: "10px",
          color: "#555",
        }}
      >
        {title}
      </h3>


      <h1
        style={{
          color: "#1976d2",
          fontSize: "32px",
          margin: "0",
        }}
      >
        {value}
      </h1>

    </div>

  );

}


export default Dashboard;